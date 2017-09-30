/**
 *  ファクトリはストリーム/メモリストリームを作成・制御する関数群
 */
import xs, { Stream, MemoryStream, Listener, Producer } from 'xstream'
import fetch from 'node-fetch'
/**
 * 適当なリテラル
 */
type Hash = { [k: string]: number }
const n:  number   = 77
const na1: number[] = [1, 2, 3]
const na2: number[] = [4, 5, 6]
const na3: number[] = [7, 8, 9]
const s:  string   = 'xyz'
const sa1: string[] = ['a', 'b', 'c']
const sa2: string[] = ['d', 'e', 'f']
const sa3: string[] = ['g', 'h', 'i']
const h:  Hash     = { a: 10, b: 20, c: 30 }
const ha: Hash[]   = [{ a: 10, b: 20, c: 30 }, { d: 40, e: 50, f: 60 }]
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
const lh: Listener<Hash> = {
  next: (h: Hash) => {
    for(let k in h) console.log(`${k} => ${h[k]}`)
  },
  error: (e: Error) => console.log(`[Hash] ${e}`),
  complete: () => console.log('[Hash] completed.')
}
/**
 * リスナーに対応したプロデューサー
 */
const pn: Producer<number> = {
  start: (ln: Listener<number>) => {
    console.log('[number] Start')
    ln.next(100)
    ln.next(200)
    ln.next(300)
    ln.complete()
  },
  stop: () => console.log('[number] End')
}
const ps: Producer<string> = {
  start: (ls: Listener<string>) => {
    console.log('[string] Start')
    ls.next('abc')
    ls.next('def')
    ls.next('ghi')
    ls.complete()
  },
  stop: () => console.log('[string] End')
}
const ph: Producer<Hash> = {
  start: (lh: Listener<Hash>) => {
    console.log('[string] Start')
    lh.next({ a: 100, b: 200, c: 300 })
    lh.next({ d: 400, e: 500, f: 600 })
    lh.next({ g: 700, h: 800, i: 900 })
    lh.complete()
  },
  stop: () => console.log('[string] End')
}
/**
 * [create] プロデューサーからストリームを作る関数
 */
console.log('=== Stream.create ===')
const n1: Stream<number> = xs.create(pn)
const s1: Stream<string> = xs.create(ps)
const h1: Stream<Hash> = xs.create(ph)
n1.subscribe(ln)
s1.subscribe(ls)
h1.subscribe(lh)
/**
 * [createWithMemory] プロデューサーからメモリストリームを作る関数
 */
console.log('=== Stream.createWithMemory ===')
const n2: MemoryStream<number> = xs.createWithMemory(pn)
const s2: MemoryStream<string> = xs.createWithMemory(ps)
const h2: MemoryStream<Hash> = xs.createWithMemory(ph)
n2.subscribe(ln)
s2.subscribe(ls)
h2.subscribe(lh)
/**
 * [never] 何もしないストリームを作る関数1（何か用途があるんだろう）
 */
console.log('=== Stream.never ===')
const n3: Stream<number> = xs.never()
const s3: Stream<string> = xs.never()
const h3: Stream<Hash> = xs.never()
n3.subscribe(ln)
s3.subscribe(ls)
h3.subscribe(lh)
/**
 * [empty] 何もしないストリームを作る関数2（completeは実行される）
 */
console.log('=== Stream.empty ===')
const n4: Stream<number> = xs.empty()
const s4: Stream<string> = xs.empty()
const h4: Stream<Hash> = xs.empty()
n4.subscribe(ln)
s4.subscribe(ls)
h4.subscribe(lh)
/**
 * [throw] リスナーのerrorを実行する関数
 */
console.log('=== Stream.throw ===')
const n5: Stream<number> = xs.throw('error ocurred.')
const s5: Stream<string> = xs.throw('error ocurred.')
const h5: Stream<Hash> = xs.throw('error ocurred.')
n5.subscribe(ln)
s5.subscribe(ls)
h5.subscribe(lh)
/**
 * [from] fromArray/fromPromise/fromObserval のエイリアス（省略）
 */
/**
 * [of] 配列からストリームを作る関数（配列展開、リテラル用）
 */
console.log('=== Stream.of ===')
const n6: Stream<number> = xs.of(...na1)
const s6: Stream<string> = xs.of(...sa1)
const h6: Stream<Hash> = xs.of(...ha)
n6.subscribe(ln)
s6.subscribe(ls)
h6.subscribe(lh)
/**
 * [fromArray] 配列からストリームを作る関数
 */
console.log('=== Stream.fromArray ===')
const n7: Stream<number> = xs.fromArray(na1)
const s7: Stream<string> = xs.fromArray(sa1)
const h7: Stream<Hash> = xs.fromArray(ha)
n7.subscribe(ln)
s7.subscribe(ls)
h7.subscribe(lh)
/**
 * [fromPromise] プロミスからストリームを作る関数
 */
console.log('=== Stream.fromPromise ===')
const url = `https://api.github.com/users?since=${Math.floor(Math.random() * 100)}`
console.log(url)
const pr: any = xs.fromPromise(fetch(url)) // <- typesがおかしい
pr.subscribe({
  next: async (x: any) => console.log((await x.json())[0]),
  error: (e: Error) => console.log(`[fetch] ${e}`),
  complete: () => console.log('[fetch] completed.')
})
/**
 * [fromObservable] オブザーブ可能なオブジェクトからストリームを作る関数
 * https://github.com/staltz/xstream/blob/master/tests/factory/fromObservable.ts
 * （他のRx系オブジェクトを入力とする関数と思われるので省略）
 */
/**
 * [periodic] 引数のミリ秒ごとに正数を出力する関数
 */
console.log('=== Stream.periodic ====')
const pd: Stream<number> = xs.periodic(1000)
const lp = {
  next: (n: number) => {
    console.log(n)
    if(n > 3) pd.removeListener(lp) // last()じゃ終わらない
  },
  error: (e: Error) => console.log(`[periodic] ${e}`),
  complete: () => console.log('[periodic] completed.')
}
pd.subscribe(lp)
/**
 * [merge] 同じ型のストリームをひとつにする関数
 */
console.log('=== Stream.merge ====')
const na: Stream<number> = xs.of(...na1)
const nb: Stream<number> = xs.of(...na2)
const nc: Stream<number> = xs.of(...na3)
const mn: Stream<number> = xs.merge(na, nb, nc)
mn.subscribe(ln)
/**
 * [combine] 異なる型のストリームをひとつにする関数
 */
console.log('=== Stream.merge ====')
const n8: Stream<number> = xs.of(...na1)
const s8: Stream<string> = xs.of(...sa1)
const h8: Stream<Hash> = xs.of(...ha)
const mc: Stream<[number, string, Hash]> = xs.combine(n8, s8, h8)
mc.subscribe({
  next: ([n, s, h]) => {
    console.log(`n -> ${n}`)
    console.log(`s -> ${s}`)
    console.log(`h -> ${h}`)
  },
  error: (e: Error) => console.log(`[combine] ${e}`),
  complete: () => console.log('[combine] completed.')
})