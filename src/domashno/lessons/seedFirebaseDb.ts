import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { v4 as uuid } from 'uuid';
import { Lesson } from '../types';

const prisma = new PrismaClient();

const configPath = `${process.cwd()}\\src\\domashno\\lessons\\firebase.json`;

const basePath = './src/domashno/lessons/';

admin.initializeApp({
  credential: admin.credential.cert(configPath),
  databaseURL: `'https://vue3-test-8db16-default-rtdb.europe-west1.firebasedatabase.app'`
});

const db = getFirestore();

const topicsCollection = db.collection('Topics');
const yearsCollection = db.collection('Years');
const booksCollection = db.collection('Books');

// const firestore = admin.firestore();
// fireorm.initialize(firestore);

// @Collection()
// class Topic {
//   id!: string;
//   title!: string;
// }

// @Collection()
// class Year {
//   id!: string;
//   title!: number;
//   topicId!: string;
//   topic!: string;
// }

// @Collection()
// class Book {
//   id!: string;
//   title!: string;
//   imgUrl?: string;
//   isbn!: string;
//   topicId!: string;
//   topic!: string;
//   yearId!: string;
//   year!: number;
// }

// @Collection()
// class Lesson {
//   id!: string;
//   title!: string;
//   tasksCount!: number;
//   bookId!: string;
// }

// @Collection()
// class Task {
//   id!: string;
//   imgUrl!: string;
//   bookId!: string;
//   lessonId!: string;
//   sequence!: number;
// }

// async function genJson() {
//   const topicRepository = getRepository(Topic);
//   const yearRepository = getRepository(Year);
//   const bookRepository = getRepository(Book);
//   const lessonRepository = getRepository(Lesson);
//   const taskRepository = getRepository(Task);

//   const dbTopics = await prisma.topic.findMany({
//     include: {
//       years: {
//         include: {
//           books: { include: { lessons: { include: { tasks: true } } } }
//         }
//       }
//     }
//   });

//   for (const topic of dbTopics) {
//     const ft = new Topic();
//     ft.title = topic.title;
//     const sTopic = await topicRepository.create(ft);

//     await prisma.topic.update({
//       where: { id: topic.id },
//       data: { fireBaseId: sTopic.id }
//     });

//     for (const year of topic.years) {
//       const fy = new Year();
//       fy.title = year.title;
//       fy.topicId = sTopic.id;
//       fy.topic = topic.title;

//       const sYear = await yearRepository.create(fy);

//       await prisma.year.update({
//         where: { id: year.id },
//         data: { fireBaseId: sYear.id }
//       });

//       for (const book of year.books) {
//         const fb = new Book();
//         fb.isbn = book.isbn;
//         fb.title = book.title;
//         fb.topicId = sTopic.id;
//         fb.topic = topic.title;
//         fb.yearId = sYear.id;
//         fb.year = year.title;

//         const sBook = await bookRepository.create(fb);

//         await prisma.book.update({
//           where: { id: book.id },
//           data: { fireBaseId: sBook.id }
//         });

//         for (const lesson of book.lessons) {
//           const fl = new Lesson();
//           fl.title = lesson.title;
//           fl.tasksCount = lesson.tasksCount;
//           fl.bookId = sBook.id;

//           const sLesson = await lessonRepository.create(fl);

//           await prisma.lesson.update({
//             where: { id: lesson.id },
//             data: { fireBaseId: sLesson.id }
//           });

//           for (const task of lesson.tasks) {
//             if (task.fireImgUrl) {
//               const ft = new Task();
//               ft.bookId = sBook.id;
//               ft.lessonId = sLesson.id;
//               ft.imgUrl = task.fireImgUrl;

//               const sTask = await taskRepository.create(ft);

//               await prisma.task.update({
//                 where: { id: task.id },
//                 data: { fireBaseId: sTask.id }
//               });
//             }
//           }
//         }
//       }
//     }
//   }
// }

async function seed() {
  const dbTopics = await prisma.topic.findMany({
    include: {
      years: {
        include: {
          books: { include: { lessons: { include: { tasks: true } } } }
        }
      }
    }
  });

  for (const topic of dbTopics) {
    const topicId = uuid();
    await topicsCollection.doc(topicId).set({ title: topic.title });

    const yearObj: any = { id: topicId, years: [] as any[] };

    for (const year of topic.years) {
      const obj: any = {
        title: year.title,
        topic: topic.title,
        books: [] as any[]
      };

      year.books.forEach((b) => {
        b.fireBaseId = uuid();
        obj.books.push({
          id: b.fireBaseId,
          title: b.title,
          img: b.fireImgUrl
        });
      });

      yearObj.years.push(obj);

      for (const book of year.books) {
        if (book.fireBaseId) {
          const bookToFirebase = {
            title: book.title,
            topic: topic.title,
            year: year.title,
            lessons: [] as {
              sequence: number;
              title: string;
              tasksCount: number;
              tasks: { img: string; sequence: number }[];
            }[]
          };

          for (const lesson of book.lessons) {
            const tasks: { img: string; sequence: number }[] = [];
            lesson.tasks.forEach((t) => {
              if (t.fireImgUrl) {
                tasks.push({ img: t.fireImgUrl, sequence: t.sequence });
              }
            });

            bookToFirebase.lessons.push({
              sequence: lesson.id,
              title: lesson.title,
              tasksCount: lesson.tasksCount,
              tasks
            });
          }

          await booksCollection.doc(book.fireBaseId).set(bookToFirebase);
        }
      }
    }

    await yearsCollection.doc(topicId).set({
      ...yearObj
    });
  }
}

seed();
