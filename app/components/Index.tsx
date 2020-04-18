import React, { useState, ChangeEvent } from 'react';
import parseEtcHost, {
  watchFileChanges,
  saveEtcHost,
  Exploded
} from '../lib/hostParser';

watchFileChanges(() => {
  // TODO: implement file save changes
});

export default function Index() {
  const [hosts, setHost] = useState(parseEtcHost());

  function handleInputRowChange(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { target } = event;
    const current = hosts[index];
    let inputChange = {};
    switch (target.name) {
      case 'ip':
        inputChange = { ip: target.value };
        break;
      case 'host':
        inputChange = { host: target.value };
        break;
      case 'disabled':
        inputChange = { disabled: !target.checked };
        break;
      default:
        break;
    }
    hosts.splice(index, 1, { ...current, ...inputChange });
    setHost([...hosts]);
  }

  function saveChanges(current: Exploded) {
    saveEtcHost(current, () => {
      setHost(parseEtcHost());
    });
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
                  name="disabled"
                  checked={!h?.disabled}
                  onChange={e => {
                    handleInputRowChange(i, e);
                  }}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-sm"
                  id="inline-full-name"
                  type="text"
                  name="ip"
                  value={h?.ip}
                  onChange={e => {
                    handleInputRowChange(i, e);
                  }}
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-sm"
                  id="inline-full-name"
                  type="text"
                  name="host"
                  value={h?.host}
                  onChange={e => {
                    handleInputRowChange(i, e);
                  }}
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  className="text-sm font-thin bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => {
                    const current = hosts[i];
                    saveChanges(current);
                  }}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-20" />
    </div>
  );
}
