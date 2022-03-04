import fetch from 'node-fetch';
import fs from 'fs';

type Uroci = {
  uroci: number;
  prefixes: string[];
};

// https://domashno.bg/matematika/8/arhimed-u/uroci
const arhimed: Uroci[] = [
  {
    uroci: 64,
    prefixes: ['t1', 't2', 'k1', 'k2']
  },
  {
    uroci: 74,
    prefixes: ['o1', 'o2']
  },
  {
    uroci: 75,
    prefixes: ['t1', 't2', 'k1', 'k2']
  },
  {
    uroci: 87,
    prefixes: ['o1', 'o2', 'o3', 'o4']
  },
  {
    uroci: 88,
    prefixes: ['t1', 't2', 'k1', 'k2']
  },
  {
    uroci: 94,
    prefixes: ['o1', 'o2']
  },
  {
    uroci: 95,
    prefixes: ['t1', 't2', 'k1', 'k2']
  },
  {
    uroci: 96,
    prefixes: ['o1']
  },
  {
    uroci: 97,
    prefixes: ['o2']
  },
  {
    uroci: 98,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 99,
    prefixes: ['k1', 'k2']
  }
];

const arhimed2: Uroci[] = [
  {
    uroci: 4,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 18,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 29,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 39,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 50,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 64,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 75,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 88,
    prefixes: ['t1', 't2']
  },
  {
    uroci: 95,
    prefixes: ['t']
  },
  {
    uroci: 99,
    prefixes: ['t1', 't2']
  }
];

async function zad() {
  const result = await fetch(
    'https://domashno.bg/matematika/8/arhimed-u/uroci/52/zadachi?zad=1',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
        Cookie:
          'XSRF-TOKEN=eyJpdiI6ImFkR1Q2clRtb1d0UytEcUVrRDA0bGc9PSIsInZhbHVlIjoiN0tlUDhMXC91Mk1DZ25FUlwvTlBMY3N5Z0tzdGhZbXJ0UWtBemtCMnhhZDlDOEFvYWdUS2UrZTJjUlwvajFWeFNsaEQySFRGVFhIcmtpV29VaVVcL08xMHRRPT0iLCJtYWMiOiJkY2E4MWQ2ZGRmOGQ1YWZiOTUyNTNjMzVkODk4ZTA2OGNhZWNhYWE0NTc1ZWRmMWZjNjlhNTM4NmMyMmVkYzI1In0%3D; laravel_session=eyJpdiI6ImhYekVIUFRIdk1FS1QxWDFTdDJBaXc9PSIsInZhbHVlIjoiYzRXNWZPR0hiU1lJaHlNNVAzWUFRZG5IcVNQNWdzZUs5KzlBdUJBNjVCMGo3OGhHN3J6SWRHZG9qOHFYK2hJZDRBUFVYZkkxVW5mcm10TzJKV3M2VHc9PSIsIm1hYyI6ImU5YzEwYjVmYWZkM2YzMmYyODM5ZTk5NzMwM2NjMmFiNTBkMjIwMTJhNzU2ZjhmNDQxZTQwMzc0ODA4Y2JmYjQifQ%3D%3D; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6ImpLVmlTdG1zTkdkNVhqbHMwUDNLTmc9PSIsInZhbHVlIjoiQ1NXQktmZlJ4cEZ2NkcxQVc5ODVlUitnMWtVZkZjTFM2b2U3MHpxdHR0S09BNGhXalRBbzZNRUF2WXdERjVpckd4SmloOFVSVDc3aEhLRktNbjNsTGRlUlFOTXZYTFcxRmEzK0d6UGhKZWs9IiwibWFjIjoiZTBmMzM3ZjFlNjRlNjgxNDUwMDg5MGQ5Nzc1NDQ2NGE1MjZjMzhhYmI5YTljNTM4YWQ1Y2U5ZTc2Y2RhMThjNCJ9',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.5',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site'
      },
      method: 'GET'
    }
  );

  return await result.text();
}

async function img(page: number, prefix: string, task: number) {
  const arhimed1 = `https://domashno.bg/zadacha?p=matematika&k=8&i=arhimed-u&u=${page}${prefix}&z=${task}`;
  const arhimed2 = `https://domashno.bg/zadacha?p=matematika&k=8&i=arhimed-new&u=${page}${prefix}&z=${task}`;
  const result = await fetch(arhimed2, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
      Cookie:
        'XSRF-TOKEN=eyJpdiI6Im4zOWZUbEk3XC83dFwvTkhseXNSNFBOdz09IiwidmFsdWUiOiJ4d00wS3BoRFQ4TW5SVExKd283Wk4zNUJ2Um5RYjZRb25cL3MwRkUxSmNBbXV2aEk0NEhBUGVOQUMraXV6M1J0ZWZHcFNWc0dTSmoyMCtiZ05qS1hsbHc9PSIsIm1hYyI6IjY4MDZkMmUwMzJlMDJlZWRkYjdiZmJhMDM2ODkwMTljODY1MTFhYWViOTk5NDg2MzlmN2NhODRjYmZlYjg2ZWYifQ%3D%3D; laravel_session=eyJpdiI6ImFYYWZxR044d3VkRkd3cU40aUVXRkE9PSIsInZhbHVlIjoiTjRZXC9mMmJhbFhWWmJvbzRyQU9uNm9YNU9wMzZ0VUE0dHhSMWl4RmJjeG1YcklRaGUwczVDd2dtR1FMbERCSXo1WUxxZ1U3aXZZVEljZ0RGanJIeTZnPT0iLCJtYWMiOiJiMjM0ZjRkOTA3NDgwMWE4ZjVjZWI0NjgzMzBhZDZkYmJmZWQ4Njc5YWEzMTdjZTUzYzhiZTZhYTc5ZDU0YjA1In0%3D; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6Ik9hclQrY2hEaGI5RkQ1aVBsYVJ2MUE9PSIsInZhbHVlIjoiOUp4ekQwOEtZUStSYWNKYUFlT0p1VFhLMklTbmQraFlxWVwvTnJuaVRPc2I4a2o0TDZ2ZWYwdytqRThBaFo2UTFmOCtxXC9BR1JUOFM0Q2tWSUpkdFlwNlc4QStHNityVlM4aGJ1SWNYcU9tQT0iLCJtYWMiOiI0ZjYzN2QyNTViYjhkYTQyOGQ3YzQwMDBjMDYwNTc3YzJhOWQ4YzNmMGMwMWFhN2FkMDFlY2Y5NzdlZTM5YjdmIn0%3D',
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

  return result;
}

async function main() {
  for (let page = 4; page <= 99; page++) {
    console.log(`doing page: ${page}`);
    const prefixes = findPrefixForPage(arhimed2, page);
    console.log({ prefixes });

    if (prefixes) {
      for (const prefix of prefixes) {
        for (let task = 1; task <= 20; task++) {
          const response = await img(page, prefix, task);

          if (response.status == 200) {
            response.body?.pipe(
              fs.createWriteStream(
                `./src/domashno/matematika arhimed/${page}-${prefix}-${task}.gif`
              )
            );
          } else {
            break;
          }
        }
      }
    } else {
      for (let task = 1; task <= 20; task++) {
        const response = await img(page, '', task);

        if (response.status == 200) {
          response.body?.pipe(
            fs.createWriteStream(
              `./src/domashno/matematika arhimed/${page}-${task}.gif`
            )
          );
        } else {
          break;
        }
      }
    }
  }
}

function findPrefixForPage(arr: Uroci[], page: number): string[] | null {
  const x = arr.filter((c) => c.uroci === page);
  if (x.length) return x[0].prefixes;
  return null;
}

main();
