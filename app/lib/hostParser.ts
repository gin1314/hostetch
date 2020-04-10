import fs from 'fs';
import path from 'path';
import net from 'net';


type Exploded = ({
  ip: string;
  disabled: boolean;
  host: string;
  index: number;
} | null)[];

export default function parse(filePath: string): Exploded {
  const etcHostFile = path.join(__dirname, '../etchosts');
  const lines = fs.readFileSync(etcHostFile, 'utf-8');
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
  const etcHostFile = path.join(__dirname, '../etchosts');
  fs.watchFile(etcHostFile, cb);
}

export function saveEtcHost(lineData: Exploded) {
  const etcHostFile = path.join(__dirname, '../etchosts');
  const lines = fs.readFileSync(etcHostFile, 'utf-8');
  const linesArr = lines.split('\n');
  const { ip, host, index, disabled } = lineData;
  linesArr.splice(index, 1, `${disabled ? '' : '#'}${ip} ${host}`);
  console.log(linesArr);
  fs.writeFileSync(etcHostFile, linesArr.join('\n'));
}
