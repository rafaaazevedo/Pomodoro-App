import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

// tipar o retorno de App() -> JSX.Element
function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer pomodoroTime={10} shortRestTime={5} longRestTime={8} cycles={4} />
      {/* defaultPomodoroTime={1500} é o argumento */}
    </div>
  );
}

export default App;