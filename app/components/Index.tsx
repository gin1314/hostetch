import React, { useState } from 'react';
import parseEtcHost, { watchFileChanges, saveEtcHost } from '../lib/hostParser';

watchFileChanges((curr, prev) => {
  const host = parseEtcHost();
  console.log(host);
  // setHost(host);
});

export default function Index() {
  const [hosts, setHost] = useState(parseEtcHost());

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

  return (
    <div className="container mx-auto px-10 mt-6">
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-base">Disable/Enable</th>
            <th className="px-4 py-2 text-base">IP</th>
            <th className="px-4 py-2 text-base">Address</th>
            <th className="px-4 py-2 text-base">Save</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((h, i) => (
            <tr key={h?.index} className="hover:bg-gray-400">
              <td className="border px-2 py-1">
                <input
                  type="checkbox"
                  defaultChecked={!h?.disabled}
                  onChange={e => {
                    handleIndividual(i, e.target.checked, 'disabled');
                  }}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-sm"
                  id="inline-full-name"
                  type="text"
                  value={h?.ip}
                  onChange={e => {
                    handleIndividual(i, e.target.value, 'ip');
                  }}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-sm"
                  id="inline-full-name"
                  type="text"
                  value={h?.host}
                  onChange={e => {
                    handleIndividual(i, e.target.value, 'host');
                  }}
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  className="text-sm font-thin bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
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
    </div>
  );
}
