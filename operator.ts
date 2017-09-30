/**
 * StreamのAPI（メソッド、オペレータ）
 */
import xs, { Stream, MemoryStream, Listener, Producer } from 'xstream'
/**
 * 型に対応したリスナー
 */
const ln: Listener<number> = {
  next: (n: number) => console.log(n),
  error: (e: Error) => console.log(`[number] ${e}`),
  complete: () => console.log('[number] completed.')
}
const ls: Listener<string> = {
  next: (s: string) => console.log(s),
  error: (e: Error) => console.log(`[string] ${e}`),
  complete: () => console.log('[string] completed.')
}
type Hash = { [k: string]: number }
const lh: Listener<Hash> = {
  next: (h: Hash) => {
    for(let k in h) console.log(`${k} => ${h[k]}`)
  },
  error: (e: Error) => console.log(`[Hash] ${e}`),
  complete: () => console.log('[Hash] completed.')
}
/**
 * リアクティブとならないため非推奨の関数（Rx互換のためにコアにあるのかな）
 * [shamefullySendNext]     (Rx Subject.onNext)     強制的に引数の値でリスナーのnextを実行
 * [shamefullySendError]    (Rx Subject.onError)    強制的に引数のエラーでリスナーのerrorを実行
 * [shamefullySendComplete] (Rx Subject.onComplete) 強制的にリスナーのcompleteを実行
 */
/**
 * [addListner] ストリームにリスナーを追加する関数
 */
console.log('=== Stream.addListener ===')
const sn = xs.create() // プロデューサー(actor)なしで作ると非推奨の関数を使うしかない
sn.addListener(ln)
sn.shamefullySendNext(1)
sn.shamefullySendNext(2)
sn.shamefullySendNext(3)
// sn.shamefullySendError('error occured.')
sn.shamefullySendComplete()
/**
 * [removeListener] ストリームからリスナーを削除する関数
 */
console.log('=== Stream.removeListener ===')
const na: number[] = [1, 2, 3]
const pd: Stream<number> = xs.periodic(500)
const lp = {
  next: (n: number) => {
    console.log(na.shift())
    if(na.length === 0) {
      pd.removeListener(lp)
      lp.complete()
    }
  },
  error: (e: Error) => console.log(`[removeListener] ${e}`),
  complete: () => console.log('[removeListener] completed.')
}
pd.addListener(lp)
/**
 * [subscribe] 
 */