import admin from 'firebase-admin';
import fs from 'fs';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

import { v4 as uuidv4 } from 'uuid';

const path2 = `${process.cwd()}\\src\\domashno\\lessons\\firebase.json`;

const bucketName = 'vue3-test-8db16.appspot.com';

admin.initializeApp({
  credential: admin.credential.cert(path2),
  databaseURL:
    'https://vue3-test-8db16-default-rtdb.europe-west1.firebasedatabase.app'
});

const storage = admin.storage().bucket(`gs://${bucketName}`);

async function upload(fileNameToUpload: string) {
  const uuid = uuidv4();

  await storage.upload(`./src/domashno/lessons/images/${fileNameToUpload}`, {
    public: true,
    gzip: true,
    destination: `domashnoe/${fileNameToUpload}`,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
      // This line is very important. It's to create a download token.
      // firebaseStorageDownloadTokens: uuidv4()
    }
  });

  const fileNameEncoded = encodeURIComponent(`domashnoe/${fileNameToUpload}`);

  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${fileNameEncoded}?alt=media&token=${uuid}`;
}

async function run() {
  const files = fs.readdirSync('./src/domashno/lessons/images/');

  for (const file of files) {
    const task = await prisma.task.findFirst({ where: { localImg: file } });

    if (!task) return;
    const firebaseUrl = await upload(file);

    await prisma.task.update({
      where: { id: task.id },
      data: { fireImgUrl: firebaseUrl }
    });
  }
}

run();
