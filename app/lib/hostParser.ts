import fs from 'fs';
import net from 'net';
import sudo from 'sudo-prompt';
// import { exec } from 'child_process';

export const ETC_HOST_FILE = '/opt/priv_host/hosts';

export type Exploded =
  | { ip: string; disabled: boolean; host: string; index: number }
  | {
      ip?: undefined;
      disabled?: undefined;
      host?: undefined;
      index?: undefined;
    };

export default function parseEtcHost() {
  const lines = fs.readFileSync(ETC_HOST_FILE, 'utf-8');
  const linesArr = lines.split('\n');
  const exploded = linesArr
    .map((v, index) => {
      const [ip, host] = v.replace('#', '').split(/\s+/);
      if (v.startsWith('#')) {
        if (net.isIPv4(ip)) {
          return { ip, disabled: true, host, index };
        }
      } else if (net.isIPv4(ip)) {
        return { ip, disabled: false, host, index };
      }
      return {};
    })
    .filter(v => Object.entries(v).length > 0);

  return exploded;
}

export function watchFileChanges(cb: {
  (curr: unknown, prev: unknown): void;
  (curr: fs.Stats, prev: fs.Stats): void;
}) {
  fs.watchFile(ETC_HOST_FILE, cb);
}

export function saveEtcHost(
  lineData: Exploded,
  failedToSaveCb: { (): void; (): void }
) {
  const lines = fs.readFileSync(ETC_HOST_FILE, 'utf-8');
  const linesArr = lines.split('\n');
  const { ip, host, index, disabled } = lineData;

  if (typeof index === 'undefined') {
    throw new Error('undefined index');
  }

  linesArr.splice(index, 1, `${disabled ? '' : '#'}${ip} ${host}`);

  fs.writeFileSync('/tmp/hostEtchScratch', linesArr.join('\n'));

  const options = {
    name: 'HostEtch'
  };
  sudo.exec(`cp /tmp/hostEtchScratch ${ETC_HOST_FILE}`, options, error => {
    if (error) {
      failedToSaveCb(lineData);
      throw error;
    }
  });
}
