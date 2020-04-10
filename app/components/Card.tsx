import React, { useState } from 'react';
import sudo from 'sudo-prompt';
import parse, { watchFileChanges, saveEtcHost } from '../lib/hostParser';

export default function Card() {
  const [hosts, setHost] = useState(parse('/et'));

  function handleIndividual(index, value, type) {
    const current = hosts[index];
    let inputChange = {};
    switch (type) {
      case 'ip':
        inputChange = { ip: value };
        break;
      case 'host':
        inputChange = { host: value };
        break;
      case 'disabled':
        inputChange = { disabled: value };
        break;
      default:
        break;
    }
    hosts.splice(index, 1, { ...current, ...inputChange });
    setHost([...hosts]);
  }

  watchFileChanges((curr, prev) => {
    const host = parse('etc');
    console.log(host);
    // setHost(host);
  });

  return (
    <div className="container mx-auto px-10 mt-6">
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Disable/Enable</th>
            <th className="px-4 py-2">IP</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Save</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((h, i) => (
            <tr key={h?.index}>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  defaultChecked={!h?.disabled}
                  onChange={e => {
                    console.log(e.target.checked, 'checked');
                    handleIndividual(i, e.target.checked, 'disabled');
                  }}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="inline-full-name"
                  type="text"
                  value={h?.ip}
                  onChange={e => {
                    handleIndividual(i, e.target.value, 'ip');
                  }}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="inline-full-name"
                  type="text"
                  value={h?.host}
                  onChange={e => {
                    handleIndividual(i, e.target.value, 'host');
                  }}
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => {
                    const current = hosts[i];
                    saveEtcHost(current);
                  }}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="container m-auto">
        <button
          type="button"
          onClick={() => {
            const options = {
              name: 'Electron'
            };
            sudo.exec('echo hello', options, (error, stdout, stderr) => {
              if (error) throw error;
              console.log('stdout: ' + stdout);
            });
          }}
        >
          sudo
        </button>
      </div>
    </div>
  );
}
