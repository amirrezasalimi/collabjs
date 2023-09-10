import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RoomProvider, useIsConnected, useIsSynced, useStorage } from "@collabjs/react";


function App() {

  const [count, update] = useStorage(data => data.count);
  const isConnected = useIsConnected();
  const isSynced = useIsSynced();



  return (
    <>
      <div>
        {
          isConnected ? "Connected" : "Disconnected"
        }
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel='noreferrer' >
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel='noreferrer' >
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          update(draft => {
            draft.count++;
          })
        }}>
          count is <span className='count'>
            {count}
          </span>
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
const AppWrapper = () => {
  return <RoomProvider config={{
    url: "ws://localhost:3000",

  }}
    storage={{
      count: 0
    }}
  >
    <App />
  </RoomProvider>
}
export default AppWrapper;
