import fs from 'fs';
import net from 'net';
import sudo from 'sudo-prompt';
import { exec } from 'child_process';

export const ETC_HOST_FILE = '/opt/priv_host/hosts';

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
      return null;
    })
    .filter(v => v);

  return exploded;
}

export function watchFileChanges(cb: {
  (curr: unknown, prev: unknown): void;
  (curr: fs.Stats, prev: fs.Stats): void;
}) {
  fs.watchFile(ETC_HOST_FILE, cb);
}

export function saveEtcHost(lineData) {
  const lines = fs.readFileSync(ETC_HOST_FILE, 'utf-8');
  const linesArr = lines.split('\n');
  const { ip, host, index, disabled } = lineData;
  linesArr.splice(index, 1, `${disabled ? '' : '#'}${ip} ${host}`);

  fs.writeFileSync('/tmp/hostEtchScratch', linesArr.join('\n'));

  const options = {
    name: 'Electron',
    icns: '/home/eugene/other_codes/hostetch/resources/icon.icns'
  };
  sudo.exec(`cp /tmp/hostEtchScratch ${ETC_HOST_FILE}`, options, error => {
    if (error) throw error;
  });
}
