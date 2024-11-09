import { db } from "./dbConfig";
import { Users, Webpages, Tokens, Deployments } from "./schema";
import { eq, sql, desc } from "drizzle-orm";
import { create } from "@web3-storage/w3up-client";
import { ethers } from "ethers";
import WebStorageABI from "./WebpageStorage.json";
import * as Name from "w3name";

export async function createOrUpdateUser(address: string, email: string) {
  try {
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.address, address))
      .execute();

    const now = new Date();

    if (existingUser.length > 0) {
      const [updatedUser] = await db
        .update(Users)
        .set({
          email,
          updatedAt: now,
          lastLogin: now,
        })
        .where(eq(Users.address, address))
        .returning()
        .execute();
      return updatedUser;
    } else {
      const [newUser] = await db
        .insert(Users)
        .values({
          address,
          email,
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
        })
        .returning()
        .execute();

      await db
        .insert(Tokens)
        .values({
          userId: newUser.id,
          balance: 0,
          stakedAmount: 0,
          rewardsEarned: 0,
        })
        .execute();

      return newUser;
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return null;
  }
}

let web3StorageClient: any;
let contract: ethers.Contract;

export async function initializeClients(userEmail: string) {
  web3StorageClient = await create();

  await web3StorageClient.login(userEmail);
  const spaces = await web3StorageClient.spaces();
  if (spaces.length > 0) {
    await web3StorageClient.setCurrentSpace(spaces[0].did());
  } else {
    throw new Error("No spaces available. Please create a space first.");
  }

  const provider = new ethers.JsonRpcProvider("https://pre-rpc.bt.io/");
  const signer = await provider.getSigner();

  contract = new ethers.Contract(
    "0x7E939AC65390E7a34e8E1b34B501D2D2a7FB2825",
    WebStorageABI.abi,
    signer
  );
}

export async function getUserIdByEmail(email: any): Promise<number | null> {
  try {
    const user = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1)
      .execute();

    return user.length > 0 ? user[0].id : null;
  } catch (error) {
    console.error("Error fetching user ID by email:", error);
    return null;
  }
}

export async function uploadToWeb3Storage(content: string, filename: string) {
  if (!web3StorageClient) {
    throw new Error("Web3Storage client not initialized");
  }
  const file = new File([content], filename, { type: "text/html" });
  const cid = await web3StorageClient.uploadFile(file);
  return cid.toString();
}

export async function storeWebpageOnChain(domain: string, content: string) {
  console.log("firing web3 storage");
  if (!contract) {
    throw new Error("Contract not initialized");
  }
  const cid = await uploadToWeb3Storage(content, "index.html");
  const tx = await contract.storeWebpage(domain, cid);
  await tx.wait();
  return { txHash: tx.hash, cid };
}

export async function createWebpage(
  userId: string | any,
  domain: string,
  content: string
) {
  const { txHash, cid } = await storeWebpageOnChain(domain, content);
  const deploymentUrl = `https://${cid}.ipfs.w3s.link/`;

  const [webpage] = await db
    .insert(Webpages)
    .values({
      userId: parseInt(userId),
      domain,
      cid,
    })
    .returning()
    .execute();

  await db
    .insert(Deployments)
    .values({
      userId: parseInt(userId),
      webpageId: webpage.id,
      transactionHash: txHash,
      deploymentUrl,
    })
    .execute();

  return { webpage, txHash, cid, deploymentUrl };
}

async function resolveNameToCID(nameString: string): Promise<string> {
  const name = Name.parse(nameString);
  const revision = await Name.resolve(name);
  return revision.value.replace("/ipfs/", "");
}

async function updateNameContent(
  userId: number,
  nameString: string,
  newContent: string
): Promise<void> {
  const keyBytes = JSON.parse(
    localStorage.getItem(`w3name_${userId}_${nameString}`) || "[]"
  );
  const name = await Name.from(new Uint8Array(keyBytes));

  const cid = await uploadToWeb3Storage(newContent, "index.html");
  const value = `/ipfs/${cid}`;

  let revision;
  try {
    revision = await Name.resolve(name);
  } catch (error) {
    revision = await Name.v0(name, value);
  }

  const nextRevision = await Name.increment(revision, value);

  await Name.publish(nextRevision, name.key);
}

async function createAndSaveName(userId: number): Promise<string> {
  const name = await Name.create();
  const nameString = name.toString();

  localStorage.setItem(
    `w3name_${userId}_${nameString}`,
    JSON.stringify(Array.from(name.key.bytes))
  );

  return nameString;
}

export async function createWebpageWithName(
  userId: string | any,
  domain: string,
  content: string
) {
  const { webpage, txHash, cid, deploymentUrl } = await createWebpage(
    userId,
    domain,
    content
  );

  const nameString = await createAndSaveName(parseInt(userId));

  await db
    .update(Webpages)
    .set({ name: nameString })
    .where(eq(Webpages.id, webpage.id))
    .execute();

  await updateNameContent(parseInt(userId), nameString, content);

  const resolvedCID = await resolveNameToCID(nameString);
  const w3nameUrl = `https://${resolvedCID}.ipfs.dweb.link`;

  return { webpage, txHash, cid, deploymentUrl, name: nameString, w3nameUrl };
}

export async function getUserWebpages(userId: number | null) {
  if (userId === null) {
    return db
      .select()
      .from(Webpages)
      .leftJoin(Deployments, eq(Webpages.id, Deployments.webpageId))
      .orderBy(desc(Deployments.deployedAt))
      .execute();
  }
  return db
    .select()
    .from(Webpages)
    .where(eq(Webpages.userId, userId))
    .leftJoin(Deployments, eq(Webpages.id, Deployments.webpageId))
    .orderBy(desc(Deployments.deployedAt))
    .execute();
}

export async function updateWebpageContent(
  userId: number,
  webpageId: number,
  newContent: string
) {
  const [webpage] = await db
    .select()
    .from(Webpages)
    .where(eq(Webpages.id, webpageId))
    .execute();

  if (!webpage) {
    throw new Error("Webpage not found");
  }

  const { txHash, cid } = await storeWebpageOnChain(webpage.domain, newContent);
  const deploymentUrl = `https://${cid}.ipfs.w3s.link/`;

  await db
    .update(Webpages)
    .set({ cid })
    .where(eq(Webpages.id, webpageId))
    .execute();

  const [existingDeployment] = await db
    .select()
    .from(Deployments)
    .where(eq(Deployments.webpageId, webpageId))
    .execute();

  if (existingDeployment) {
    await db
      .update(Deployments)
      .set({
        transactionHash: txHash,
        deploymentUrl,
        deployedAt: new Date(),
      })
      .where(eq(Deployments.id, existingDeployment.id))
      .execute();
  } else {
    await db
      .insert(Deployments)
      .values({
        userId,
        webpageId,
        transactionHash: txHash,
        deploymentUrl,
      })
      .execute();
  }

  if (webpage.name) {
    await updateNameContent(userId, webpage.name, newContent);
    const resolvedCID = await resolveNameToCID(webpage.name);
    const w3nameUrl = `https://${resolvedCID}.ipfs.dweb.link`;
    return { txHash, cid, deploymentUrl, w3nameUrl };
  }

  return { txHash, cid, deploymentUrl };
}

export async function getWebpageContent(webpageId: number): Promise<string> {
  const webpage = await db
    .select()
    .from(Webpages)
    .where(eq(Webpages.id, webpageId))
    .leftJoin(Deployments, eq(Webpages.id, Deployments.webpageId))
    .orderBy(desc(Deployments.deployedAt))
    .limit(1)
    .execute();

  if (webpage.length === 0) {
    throw new Error("Webpage not found");
  }

  const cid = webpage[0].webpages.cid;
  const response = await fetch(`https://${cid}.ipfs.w3s.link/`);
  const content = await response.text();

  return content;
}
