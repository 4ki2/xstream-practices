# xstream 練習用
* リスナーとインターナルリスナーは異なる
```
export interface Listener<T> {
  next: (x: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

export interface InternalListener<T> {
  _n: (v: T) => void;
  _e: (err: any) => void;
  _c: () => void;
}
```

* ストリームはインターナルリスナーの実装
```
export declare class Stream<T> implements InternalListener<T>
```

* メモリストリームはストリームの拡張
```
export declare class MemoryStream<T> extends Stream<T>
```

* プロデューサーはリスナーのクロージャ
```
export interface Producer<T> {
  start: (listener: Listener<T>) => void;
  stop: () => void;
}
```