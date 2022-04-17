// setInterval com callBack e time daria problema, pois iria renderizar toda hora os componentes, portanto usar Hooks.
// Making setInterval Declarative with React Hooks:
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// é um código JS, portanto passar para TS

import React, { useState, useEffect, useRef } from 'react';

// return -> void
// delay -> number | void
// tipar o callback -> usar generics -> <C extends CallableFunction>
//exportar
export function useInterval<C extends CallableFunction>(callback: C, delay: number | null): void {
  const savedCallback = useRef<C>(); //referenciando savedCallback é do tipo C

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    //fazer um type guard para saber se esse objeto não é undefined
    function tick() {
      // savedCallback.current();
      if (savedCallback.current) savedCallback.current(); // se existir não é undefined
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
