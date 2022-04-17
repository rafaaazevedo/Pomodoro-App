import React, { useEffect, useCallback } from 'react'; // é do react
// import { useInterval } from '../hooks/use-interval';
import { useInterval } from '../hooks/useInterval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

const bellStart = require('../sounds/src_sounds_bell-start.mp3');
const bellFinish = require('../sounds/src_sounds_bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

// props = pomodoroTime, com tipo Props
interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = React.useState(false);//variável pra mostrar se useInterval ta contando ou não tá contando. Inicia em false, Timer não começa contando(null).
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false); //novo estado
  const [cyclesQtdManager, setCyclesQtdManager] = React.useState(new Array(props.cycles - 1).fill(true)); //três elementos no array. Cada elemento tem valor igual a true.

  // console.log(cycles);

  const [completedCycles, setCompleteCycles] = React.useState(0); //não completou nenhum ciclo
  const [fullWorkingTime, setFullWorkingTime] = React.useState(0);
  const [numberOfPomodoro, setNumberOfPomodoros] = React.useState(0);

  // Conta o tempo (componente Timer) decrementado de 1 em 1 segundo
  useInterval(() => {
    setMainTime(mainTime - 1);
    if(working) setFullWorkingTime(fullWorkingTime + 1); // details: número de horas trabalhadas
  }, timeCounting ? 1000 : null); //**funcionamento: estado timeCounting começa em false -> null(não conta), se for true(button work clicado) conta de 1 em 1segundo
  // passar callback(função) e um delay(ou null)
  // 1000 = 1 segundo, conta de um em um segundo(podia ser de 2 em dois segundos)


  const configureWork = useCallback(() => {
    setTimeCounting(true); // useInterval começa a contar
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime); //seta o com o tempo 10s(total), serve para zerar ou recomeçar, quando clica no botão
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTime,
  ]); // [setTimeCounting, setWorking, ...] são dependências

  const configureRest = useCallback((long: boolean) => {
    setTimeCounting(true); //vai contar
    setWorking(false);
    setResting(true); // ativa o tempo de descanso

    if(long) {
      setMainTime(props.longRestTime); // começa a contar o tempo de descanso longo
    } else {
      setMainTime(props.shortRestTime);  //  começa a contar o tempo de descanso curto
    }
    audioStopWorking.play();
  }, [setTimeCounting, setWorking, setResting, setMainTime, props.longRestTime, props.shortRestTime]);

  // basicamente se clicar em work, muda o fundo pra laranja
  useEffect(() => {
    if(working) document.body.classList.add('working');
    if(resting) document.body.classList.remove('working');

    /*Só quando acabar o tempo*/
    if(mainTime > 0) return; // se o contador não tiver acabado, não vai passar dessa linha

    /*Só quando acabar o tempo*/

    //se tiver terminado de contar o tempo trabalhando, muda para o tempo de descanso
    if(working && cyclesQtdManager.length > 0) { // se a pessoa estiver trabalhando e ainda está no mesmo ciclo
      configureRest(false); // pausa(rest) curta, envia false
      cyclesQtdManager.pop(); // menos uma pausa (são 4 pausas curtas)
    } else if(working && cyclesQtdManager.length <= 0){
      configureRest(true); // pausa longa
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true)); //cria um novo array
      setCompleteCycles(completedCycles + 1);
    }

    if(working) setNumberOfPomodoros(numberOfPomodoro + 1); // details
    if(resting) configureWork(); //se tiver terminado de contar o tempo descansando, muda para o tempo de trabalhando
  }, [working, resting, mainTime, cyclesQtdManager, numberOfPomodoro, completedCycles, configureRest, setCyclesQtdManager, configureWork, props.cycles]); // [working] -> é uma dependencia

  return(
    <div className='pomodoro'>
      <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime} />
      <div className='controls'>
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button className={!working && !resting ? 'hidden' : ''} text={timeCounting ? 'Pause' : 'Play'} onClick={() => setTimeCounting(!timeCounting)}></Button>
        {/* setTimeCounting(!setTimeCounting) -> toggle, se tava contando, pausa. Se tava pausado, conta. Inverte os valores, se tá pausado, despausa e vice-versa */}
        {/* !working && !resting ? 'hidden' : '' -> desaparece o botão pausar quando nenhum dos outros dois são ativados*/}
      </div>

      <div className='details'>
       <p>Ciclos concluídos: {completedCycles}</p>
       <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)} </p>
       <p>Pomodoros concluídos: {numberOfPomodoro}</p>
      </div>
    </div>
  );
}
