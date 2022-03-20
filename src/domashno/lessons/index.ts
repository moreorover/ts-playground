import fetch from 'node-fetch';
import { writeToJson } from '../../writeToJson.js';
import { parse } from 'node-html-parser';
import { topics } from './topics.js';
import fs from 'fs';

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

downloadTasks();

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
