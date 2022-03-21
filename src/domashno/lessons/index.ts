import fetch from 'node-fetch';
import { writeToJson } from '../../writeToJson.js';
import { parse } from 'node-html-parser';
import { topics } from './topics.js';
import fs from 'fs';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const basePath = './src/domashno/lessons/';

async function fetchHtml(lesson: string) {
  const result = await fetch(lesson, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
      Cookie:
        'remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IlZaYnQraGZoQzhZTXRzSnljU3J1SVE9PSIsInZhbHVlIjoiU01LVHBcL1VkUGRKUVRUVzluc2E5UHpOSjF0ODNWUmlvQVhYODhGQ0c2dnJLUDVXTER5Z2FXSk9uTE5VVzBURFwvbEhGZXBpS1dBR1J1R0tLWE1GVXNzOWxSOUc2Z1Q0SFpLVEkya29iUWNDMD0iLCJtYWMiOiI3NjJjMTcwZjlmOTY4ZGIwOWU5MzVkYTE0NmNjOWI4MWEwZTMzNWJmNDkzNjY2MzU2NDViZjRhOGQxNTI4MGU1In0%3D; XSRF-TOKEN=eyJpdiI6InY4SkF2a3I2V0ljaHJGckpva1E3WWc9PSIsInZhbHVlIjoiQUJ0N3RGSkhkQnBVVkx0ZXBPOG00ODBkUVVRSUlxRjZJNUZ0d1NUVndiOWU2REE0b2Uxa3JWWkVJaDM5RWV4UTVnaG05dkNjck15VHNxUTBWTG5kenc9PSIsIm1hYyI6Ijc5NWRhMjIwNDAwNDQwY2QwOTJlZWRiZmNiN2JkZTVlZGFkMzg0MGUyMjAwMzQ2ZGU3OThmMTg2NWZiOTQxOGQifQ%3D%3D; laravel_session=eyJpdiI6InZUUjZKNjJDWkluSUw3V3FCaVM2MFE9PSIsInZhbHVlIjoidXhSTFJtQWdXSFN2dmZld01mRWhtOStVbjRUQ3lyQW1HUThFOTZ1RHpLV3M2NlROVmpQMzlTajRuRCsrdWYwVE04Q1hHcVJXVkFqMVF1ajc0M3FkeHc9PSIsIm1hYyI6ImY5YWMyODRhY2Q1NzEzMmQ1MTRhNDYwZTU3Yzc2MmU3NmNhM2E5YTZjYmQ2Yzc3OGQyZDJmYTgzMzVmYmJiNzgifQ%3D%3D',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.5',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site'
    },
    method: 'GET'
  });

  if (!result.ok) {
    console.log('something went wrong');
    return null;
  }

  return result.text();
}

async function fetchImage(url: string) {
  return await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
      Cookie:
        'remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IlZaYnQraGZoQzhZTXRzSnljU3J1SVE9PSIsInZhbHVlIjoiU01LVHBcL1VkUGRKUVRUVzluc2E5UHpOSjF0ODNWUmlvQVhYODhGQ0c2dnJLUDVXTER5Z2FXSk9uTE5VVzBURFwvbEhGZXBpS1dBR1J1R0tLWE1GVXNzOWxSOUc2Z1Q0SFpLVEkya29iUWNDMD0iLCJtYWMiOiI3NjJjMTcwZjlmOTY4ZGIwOWU5MzVkYTE0NmNjOWI4MWEwZTMzNWJmNDkzNjY2MzU2NDViZjRhOGQxNTI4MGU1In0%3D; XSRF-TOKEN=eyJpdiI6IlJrbVFPSWhRUHBHbkJISnp2dTZKWXc9PSIsInZhbHVlIjoibDBmR25zWUlxZmNvU2pWYzlNakoyeVlod096NlFPUW5oM0hENTg4VnlPRE51OFdjMkhjV0tpa2pBY2pMbEJ1VXp6SDhVeWYzc1ByaGpKWkRWcmZtK3c9PSIsIm1hYyI6Ijc2ZDE2NDRiYTQyZWM5N2IxYTU0OWJkYzk3NTg4MTZmY2EzMGExYzI1MjczYWU2YjgxNDVjYzQ3ZDNkYzg2ZWMifQ%3D%3D; laravel_session=eyJpdiI6ImZjTFI5dE5EYW9FVmkrQlNKdU1qZmc9PSIsInZhbHVlIjoiMk91WU5PK1VLelY2RXFTWXRZSFhRY1FxZWphTjI1UEZHalZvRDBWcnFhdjdWckhlRXBxU1wvRnVmVG1iVnZrdE9VODVEWWJJeldZVUwzS3JyQ0FKZFF3PT0iLCJtYWMiOiJhOGQ4ZGM4MWE3ODdhMWQ5MDY1M2IyMzhlZmY2NWY5NjUwNDMyNjk4NGM5ZWE5MDAxNmZjNGJhZDRhMjFjZDZlIn0%3D',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.5',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    },
    method: 'GET'
  });
}

async function getLessons() {
  for (const t of topics) {
    for (const y of t.years) {
      for (const b of y.books) {
        const html = await fetchHtml(b.url);
        if (!html) {
          return;
        }
        const parsedHtml = parse(html);

        const lessonDivs = parsedHtml.querySelectorAll(
          'a.list-group-item.rounded'
        );

        lessonDivs.forEach((ld) => {
          const id = ld.getAttribute('data-lesson') || '';
          const title = ld.text;

          b.lessons.push({ id, title, tasksCount: 0, taskIds: [] });
        });
      }
    }
  }

  writeToJson(JSON.stringify(topics, null, 2), basePath + 'books3.json');
}

async function getTasksCount() {
  const { lessonsCount } = await getLessonsCount();

  let lesson = 0;

  for (const t of topics) {
    for (const y of t.years) {
      for (const b of y.books) {
        for (const l of b.lessons) {
          const html = await fetchHtml(`${b.url}/${l.id}/zadachi`);
          if (!html) {
            return;
          }
          const parsedHtml = parse(html);

          const tasksDiv =
            parsedHtml?.querySelector('div#problems')?.querySelectorAll('li') ||
            [];

          const tasksCount = tasksDiv?.length || -1;
          l.tasksCount = tasksCount;

          for (const div of tasksDiv) {
            const taskId = parseInt(div.text);

            l.taskIds.push(taskId);
          }
          lesson++;
          console.log(`Finished lesson ${lesson} out of ${lessonsCount}`);
        }
      }
    }
  }
  writeToJson(JSON.stringify(topics, null, 2), basePath + 'books5.json');
}

async function getLessonsCount() {
  let lessonsCount = 0;
  let tasksCount = 0;

  for (const t of topics) {
    for (const y of t.years) {
      for (const b of y.books) {
        lessonsCount += b.lessons.length;
        for (const l of b.lessons) {
          tasksCount += l.tasksCount;
        }
      }
    }
  }
  console.log('Count of lessons: ', lessonsCount);
  console.log('Count of tasks: ', tasksCount);
  return { lessonsCount, tasksCount };
}

async function downloadTasks() {
  fs.mkdirSync(`${basePath}/images`, {
    recursive: true
  });

  const { tasksCount } = await getLessonsCount();

  let currentTask = 0;

  for (const t of topics) {
    for (const y of t.years) {
      for (const b of y.books) {
        for (const l of b.lessons) {
          fs.mkdirSync(`${basePath}/${t.topic}/${y.title}/${b.title}/${l.id}`, {
            recursive: true
          });
          l.tasks = [];
          for (const task of l.taskIds) {
            // https://domashno.bg/matematika/5/anubis-new/uroci/1/zadachi/4
            // https://domashno.bg/zadacha?p=matematika&k=5&i=anubis-new&u=1&z=4
            const url = `https://domashno.bg/zadacha?p=${t.topic}&k=${y.title}&i=${b.id}&u=${l.id}&z=${task}`;

            const response = await fetchImage(url);

            if (response.status == 200) {
              l.tasks = [];

              l.tasks.push({
                url,
                sequence: task,
                img: `${t.topic}-${y.title}-${b.id}-${l.id}-${task}.gif`
              });

              response.body?.pipe(
                fs.createWriteStream(
                  `${basePath}/${t.topic}/${y.title}/${b.title}/${l.id}/${task}.gif`
                )
              );

              response.body?.pipe(
                fs.createWriteStream(
                  `${basePath}/images/${t.topic}-${y.title}-${b.id}-${l.id}-${task}.gif`
                )
              );

              currentTask++;

              console.log(
                `Finished task number ${currentTask} of ${tasksCount}`
              );
            }
          }
        }
      }
    }
  }
  writeToJson(JSON.stringify(topics, null, 2), basePath + 'books8.json');
}

// downloadTasks();

async function parseBookIds() {
  for (const t of topics) {
    for (const y of t.years) {
      for (const b of y.books) {
        const splits = b.url.split('/');
        const l = splits.length;
        b.id = splits[l - 2];
      }
    }
  }
  writeToJson(JSON.stringify(topics, null, 2), basePath + 'books7.json');
}

async function seed() {
  for (const topic of topics) {
    const st = await prisma.topic.create({
      data: { title: topic.topic }
    });
    for (const y of topic.years) {
      const sy = await prisma.year.create({
        data: { title: y.title, topicId: st.id }
      });
      for (const b of y.books) {
        const sb = await prisma.book.create({
          data: {
            isbn: b.id,
            title: b.title,
            url: b.url,
            remoteImgUrl: b.img,
            yearId: sy.id
          }
        });

        for (const l of b.lessons) {
          const sl = await prisma.lesson.create({
            data: {
              tasksCount: l.tasksCount,
              title: l.title,
              bookId: sb.id,
              taskIds: l.taskIds,
              gid: l.id
            }
          });

          for (const t of l.taskIds) {
            const st = await prisma.task.create({
              data: {
                sequence: t,
                url: `https://domashno.bg/zadacha?p=${topic.topic}&k=${y.title}&i=${b.id}&u=${l.id}&z=${t}`,
                lessonId: sl.id
              }
            });
          }
        }
      }
    }
  }
}

// seed();

async function mapImages() {
  const files = fs.readdirSync('./src/domashno/lessons/images/');

  // files.forEach((f) => console.log(f));

  for (const file of files) {
    const fileTrimmed = file.replace('.gif', '');

    const splits = fileTrimmed.split('-');

    const l = splits.length;

    console.log(file);

    const topic = splits[0];
    const year = parseInt(splits[1]);
    const bookIsbn = `${splits[2]}-${splits[3]}`;
    const lesson = splits[4];
    const task = parseInt(splits[5]);

    console.log({ topic, year, bookIsbn, lesson, task });

    const dbTopic = await prisma.topic.findFirst({
      where: { title: topic },
      include: {
        years: {
          where: { title: year },
          include: {
            books: {
              where: { isbn: bookIsbn },
              include: {
                lessons: {
                  where: { gid: lesson },
                  include: { tasks: { where: { sequence: task } } }
                }
              }
            }
          }
        }
      }
    });

    const dbTask = dbTopic?.years[0].books[0].lessons[0].tasks[0];

    if (dbTask) {
      const newImageName = `${topic}+${year}+${bookIsbn}+${lesson}+${task}.gif`;

      fs.rename(
        `${basePath}/images/${file}`,
        `${basePath}/images/${newImageName}`,
        (err) => {
          if (err) console.log('Error: ', err);
        }
      );

      await prisma.task.update({
        where: { id: dbTask.id },
        data: {
          localImg: newImageName
        }
      });
    }
  }
}

// mapImages();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadTaskImages() {
  let responseCode = -1;

  const taskWithImageNull = await prisma.task.findFirst({
    where: { localImg: null },
    include: {
      lesson: {
        include: { book: { include: { year: { include: { topic: true } } } } }
      }
    }
  });

  console.log(
    `Downloading for: ${taskWithImageNull?.id} - ${taskWithImageNull?.url}`
  );

  if (taskWithImageNull?.url) {
    const response = await fetchImage(taskWithImageNull?.url);

    console.log('Response status: ', response.status);

    if (response.status == 200) {
      responseCode = 200;
      fs.mkdirSync(
        `${basePath}/${taskWithImageNull.lesson.book.year.topic.title}/${taskWithImageNull.lesson.book.year.title}/${taskWithImageNull.lesson.book.title}/${taskWithImageNull.lesson.gid}`,
        {
          recursive: true
        }
      );

      response.body?.pipe(
        fs.createWriteStream(
          `${basePath}/${taskWithImageNull.lesson.book.year.topic.title}/${taskWithImageNull.lesson.book.year.title}/${taskWithImageNull.lesson.book.title}/${taskWithImageNull.lesson.gid}/${taskWithImageNull.sequence}.gif`
        )
      );

      response.body?.pipe(
        fs.createWriteStream(
          `${basePath}/images/${taskWithImageNull.lesson.book.year.topic.title}+${taskWithImageNull.lesson.book.year.title}+${taskWithImageNull.lesson.book.isbn}+${taskWithImageNull.lesson.gid}+${taskWithImageNull.sequence}.gif`
        )
      );

      await prisma.task.update({
        where: { id: taskWithImageNull.id },
        data: {
          localImg: `${taskWithImageNull.lesson.book.year.topic.title}+${taskWithImageNull.lesson.book.year.title}+${taskWithImageNull.lesson.book.isbn}+${taskWithImageNull.lesson.gid}+${taskWithImageNull.sequence}.gif`
        }
      });
    }
  }

  return responseCode;
}

async function runLoop() {
  let runLoop = true;

  while (runLoop) {
    let code200 = 0;
    let code404 = 0;

    const waitFor = Math.random() * (10 - 3) + 3;

    console.log(`Waiting for: ${waitFor} seconds.`);

    await delay(waitFor * 1000);
    const code = await downloadTaskImages();

    console.log({ code });

    if (code == 200) code200++;
    if (code != 200) code404++;

    if (code404 > 0) {
      console.log(`Count of 200 response codes: ${code200}`);

      runLoop = false;
    }
  }
}

runLoop();
