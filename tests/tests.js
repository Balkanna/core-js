(function(){
  var from, iterator, toString$ = {}.toString;
  QUnit.module('$for');
  from = Array.from;
  iterator = Symbol.iterator;
  test('$for', function(){
    var set, iter;
    ok(typeof $for === 'function', 'Is function');
    ok(iterator in $for.prototype);
    set = new Set(['1', '2', '3', '2', '1']);
    iter = $for(set);
    ok(iter instanceof $for);
    ok(toString$.call(iter[iterator]()).slice(8, -1) === 'Set Iterator');
    deepEqual(['1', '2', '3'], from(iter));
  });
  test('$for::filter', function(){
    var set, iter, o;
    ok(typeof $for.prototype.filter === 'function', 'Is function');
    set = new Set(['1', '2', '3', '2', '1']);
    iter = $for(set).filter((function(it){
      return it % 2;
    }));
    ok(iter instanceof $for);
    deepEqual(['1', '3'], from(iter));
    deepEqual([[1, 2]], from($for([1, 2, 3].entries(), true).filter(function(k, v){
      return k % 2;
    })));
    $for([1]).filter(function(){
      return ok(this === o);
    }, o = {});
  });
  test('$for::map', function(){
    var set, iter, o;
    ok(typeof $for.prototype.map === 'function', 'Is function');
    set = new Set(['1', '2', '3', '2', '1']);
    iter = $for(set).map((function(it){
      return it * 2;
    }));
    ok(iter instanceof $for);
    deepEqual([2, 4, 6], from(iter));
    deepEqual([[0, 1], [2, 4], [4, 9]], from($for([1, 2, 3].entries(), true).map(function(k, v){
      return [k * 2, v * v];
    })));
    $for([1]).map(function(){
      return ok(this === o);
    }, o = {});
  });
  test('$for::array', function(){
    var set, o;
    ok(typeof $for.prototype.array === 'function', 'Is function');
    set = new Set([1, 2, 3, 2, 1]);
    deepEqual([[1, 1], [2, 2], [3, 3]], $for(set.entries()).array());
    deepEqual([2, 4, 6], $for(set).array((function(it){
      return it * 2;
    })));
    deepEqual([[0, 1], [2, 4], [4, 9]], $for([1, 2, 3].entries(), true).array(function(k, v){
      return [k * 2, v * v];
    }));
    $for([1]).array(function(){
      return ok(this === o);
    }, o = {});
  });
  test('$for::of', function(){
    var set, counter1, string1, counter2, string2, o;
    ok(typeof $for.prototype.of === 'function', 'Is function');
    set = new Set(['1', '2', '3', '2', '1']);
    counter1 = 0;
    string1 = '';
    $for(set).of(function(it){
      counter1++;
      string1 += it;
    });
    ok(counter1 === 3);
    ok(string1 === '123');
    counter2 = 0;
    string2 = '';
    $for(set.entries()).of(function(it){
      counter2++;
      string2 += it[0] + it[1];
    });
    ok(counter2 === 3);
    ok(string2 === '112233');
    $for([1].entries(), true).of(function(key, val){
      ok(this === o);
      ok(key === 0);
      return ok(val === 1);
    }, o = {});
  });
  test('$for chaining', function(){
    deepEqual([2, 10], $for([1, 2, 3]).map((function(it){
      return Math.pow(it, 2);
    })).filter((function(it){
      return it % 2;
    })).map((function(it){
      return it + 1;
    })).array());
    deepEqual([[1, 1], [3, 9]], $for([1, 2, 3].entries(), true).map(function(k, v){
      return [k, Math.pow(v, 2)];
    }).filter(function(k, v){
      return v % 2;
    }).map(function(k, v){
      return [k + 1, v];
    }).array());
  });
  test('$for.isIterable', function(){
    var isIterable;
    isIterable = $for.isIterable;
    ok(typeof isIterable === 'function', 'Is function');
    ok(!isIterable({}));
    ok(isIterable([]));
    ok(isIterable(function(){
      return arguments;
    }()));
  });
  test('$for.getIterator', function(){
    var getIterator, e, iter;
    getIterator = $for.getIterator;
    ok(typeof getIterator === 'function', 'Is function');
    try {
      getIterator({});
      ok(false);
    } catch (e$) {
      e = e$;
      ok(true);
    }
    iter = getIterator([]);
    ok('next' in iter);
    iter = getIterator(function(){
      return arguments;
    }());
    ok('next' in iter);
  });
}).call(this);

(function(){
  var isFunction, toString$ = {}.toString;
  QUnit.module('Array');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  test('::contains', function(){
    var arr, o;
    ok(isFunction(Array.prototype.contains), 'Is function');
    arr = [1, 2, 3, -0, NaN, o = {}];
    ok(arr.contains(1));
    ok(arr.contains(-0));
    ok(arr.contains(0));
    ok(arr.contains(NaN));
    ok(arr.contains(o));
    ok(!arr.contains(4));
    ok(!arr.contains(-0.5));
    ok(!arr.contains({}));
    ok(Array(1).contains(void 8));
  });
  test('::turn', function(){
    var arr, obj;
    ok(isFunction(Array.prototype.turn), 'Is function');
    (arr = [1]).turn(function(memo, val, key, that){
      deepEqual([], memo, 'Default memo is array');
      ok(val === 1, 'First argumert is value');
      ok(key === 0, 'Second argumert is index');
      return ok(that === arr, 'Third argumert is array');
    });
    [1].turn(function(memo){
      return ok(memo === obj, 'Can reduce to exist object');
    }, obj = {});
    deepEqual([3, 2, 1], [1, 2, 3].turn(function(memo, it){
      return memo.unshift(it);
    }), 'Reduce to object and return it');
  });
}).call(this);

(function(){
  var isFunction, slice, toString$ = {}.toString;
  QUnit.module('Array statics');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  slice = Array.prototype.slice;
  test('are functions', function(){
    var i$, x$, ref$, len$;
    for (i$ = 0, len$ = (ref$ = ['concat', 'join', 'pop', 'push', 'reverse', 'shift', 'slice', 'sort', 'splice', 'unshift', 'indexOf', 'lastIndexOf', 'every', 'some', 'forEach', 'map', 'filter', 'reduce', 'reduceRight', 'fill', 'find', 'findIndex', 'keys', 'values', 'entries', 'turn', 'contains']).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(isFunction(Array[x$]), "Array." + x$ + " is function");
    }
  });
  test('.join', function(){
    var join;
    join = Array.join;
    ok(join('123') === '1,2,3');
    ok(join('123', '|') === '1|2|3');
    ok(join(function(){
      return arguments;
    }(3, 2, 1), '|') === '3|2|1');
  });
  test('.pop', function(){
    var pop, args;
    pop = Array.pop;
    ok(pop(args = function(){
      return arguments;
    }(1, 2, 3)) === 3);
    deepEqual(args, function(){
      return arguments;
    }(1, 2));
  });
  test('.push', function(){
    var push, args;
    push = Array.push;
    push(args = function(){
      return arguments;
    }(1, 2, 3), 4, 5);
    deepEqual(slice.call(args), [1, 2, 3, 4, 5]);
  });
  test('.reverse', function(){
    var reverse;
    reverse = Array.reverse;
    deepEqual(reverse(function(){
      return arguments;
    }(1, 2, 3)), function(){
      return arguments;
    }(3, 2, 1));
  });
  test('.shift', function(){
    var shift, args;
    shift = Array.shift;
    ok(shift(args = function(){
      return arguments;
    }(1, 2, 3)) === 1);
    deepEqual(args, function(){
      return arguments;
    }(2, 3));
  });
  test('.unshift', function(){
    var unshift, args;
    unshift = Array.unshift;
    unshift(args = function(){
      return arguments;
    }(1, 2, 3), 4, 5);
    deepEqual(slice.call(args), [4, 5, 1, 2, 3]);
  });
  test('.slice', function(){
    var slice;
    slice = Array.slice;
    deepEqual(slice('123'), ['1', '2', '3']);
    deepEqual(slice('123', 1), ['2', '3']);
    deepEqual(slice('123', 1, 2), ['2']);
    deepEqual(slice('123', 1, -1), ['2']);
    deepEqual(slice(function(){
      return arguments;
    }(1, 2, 3)), [1, 2, 3]);
    deepEqual(slice(function(){
      return arguments;
    }(1, 2, 3), 1), [2, 3]);
    deepEqual(slice(function(){
      return arguments;
    }(1, 2, 3), 1, 2), [2]);
    deepEqual(slice(function(){
      return arguments;
    }(1, 2, 3), 1, -1), [2]);
  });
  test('.splice', function(){
    var splice, args;
    splice = Array.splice;
    splice(args = function(){
      return arguments;
    }(1, 2, 3), 1, 0, 4, 5);
    deepEqual(slice.call(args), [1, 4, 5, 2, 3]);
    splice(args = function(){
      return arguments;
    }(1, 2, 3), 1, 1, 4);
    deepEqual(slice.call(args), [1, 4, 3]);
    splice(args = function(){
      return arguments;
    }(1, 2, 3), 1, 1);
    deepEqual(slice.call(args), [1, 3]);
  });
  test('.sort', function(){
    var sort;
    sort = Array.sort;
    deepEqual(sort(function(){
      return arguments;
    }(2, 1, 3)), function(){
      return arguments;
    }(1, 2, 3));
    deepEqual(sort(function(){
      return arguments;
    }(11, 2, 3)), function(){
      return arguments;
    }(11, 2, 3));
    deepEqual(sort(function(){
      return arguments;
    }(11, 2, 3), function(a, b){
      return a - b;
    }), function(){
      return arguments;
    }(2, 3, 11));
  });
  test('.indexOf', function(){
    var indexOf;
    indexOf = Array.indexOf;
    ok(indexOf('111', '1') === 0);
    ok(indexOf('123', '1', 1) === -1);
    ok(indexOf('123', '2', 1) === 1);
    ok(indexOf(function(){
      return arguments;
    }(1, 1, 1), 1) === 0);
    ok(indexOf(function(){
      return arguments;
    }(1, 2, 3), 1, 1) === -1);
    ok(indexOf(function(){
      return arguments;
    }(1, 2, 3), 2, 1) === 1);
  });
  test('.lastIndexOf', function(){
    var lastIndexOf;
    lastIndexOf = Array.lastIndexOf;
    ok(lastIndexOf('111', '1') === 2);
    ok(lastIndexOf('123', '3', 1) === -1);
    ok(lastIndexOf('123', '2', 1) === 1);
    ok(lastIndexOf(function(){
      return arguments;
    }(1, 1, 1), 1) === 2);
    ok(lastIndexOf(function(){
      return arguments;
    }(1, 2, 3), 3, 1) === -1);
    ok(lastIndexOf(function(){
      return arguments;
    }(1, 2, 3), 2, 1) === 1);
  });
  test('.every', function(){
    var every, al, ctx;
    every = Array.every;
    every(al = function(){
      return arguments;
    }(1), function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    ok(every('123', function(it){
      return toString$.call(it).slice(8, -1) === 'String';
    }));
    ok(every('123', function(){
      return arguments[1] < 3;
    }));
    ok(!every('123', function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
    ok(!every('123', function(){
      return arguments[1] < 2;
    }));
    ok(every('123', function(){
      return arguments[2] == '123';
    }));
    ok(every(function(){
      return arguments;
    }(1, 2, 3), function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
  });
  test('.some', function(){
    var some, al, ctx;
    some = Array.some;
    some(al = function(){
      return arguments;
    }(1), function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    ok(some('123', function(it){
      return toString$.call(it).slice(8, -1) === 'String';
    }));
    ok(some('123', function(){
      return arguments[1] > 1;
    }));
    ok(!some('123', function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
    ok(!some('123', function(){
      return arguments[1] > 3;
    }));
    ok(some('123', function(){
      return arguments[2] == '123';
    }));
    ok(some(function(){
      return arguments;
    }(1, 2, 3), function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
  });
  test('.forEach', function(){
    var forEach, al, ctx, val;
    forEach = Array.forEach;
    forEach(al = function(){
      return arguments;
    }(1), function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      ok(that === al);
    }, ctx = {});
    val = '';
    forEach('123', function(v, k, t){
      val += v + k + t;
    });
    ok(val === '101232112332123');
    val = '';
    forEach(function(){
      return arguments;
    }(1, 2, 3), function(v, k, t){
      val += v + k + t['2'];
    });
    ok(val === '468');
    val = '';
    forEach('123', function(v, k, t){
      val += v + k + t + this;
    }, 1);
    ok(val === '101231211231321231');
  });
  test('.map', function(){
    var map, al, ctx;
    map = Array.map;
    map(al = function(){
      return arguments;
    }(1), function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    deepEqual(map('123', (function(it){
      return Math.pow(it, 2);
    })), [1, 4, 9]);
    deepEqual(map(function(){
      return arguments;
    }(1, 2, 3), (function(it){
      return Math.pow(it, 2);
    })), [1, 4, 9]);
  });
  test('.filter', function(){
    var filter, al, ctx;
    filter = Array.filter;
    filter(al = function(){
      return arguments;
    }(1), function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    deepEqual(filter('123', function(it){
      return it > 1;
    }), ['2', '3']);
    deepEqual(filter(function(){
      return arguments;
    }(1, 2, 3), function(it){
      return it < 3;
    }), [1, 2]);
    deepEqual(filter('123', function(){
      return arguments[1] !== 1;
    }), ['1', '3']);
  });
  test('.reduce', function(){
    var reduce, al, ctx;
    reduce = Array.reduce;
    reduce(al = function(){
      return arguments;
    }(1), function(memo, val, key, that){
      ok(memo === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    reduce(al = function(){
      return arguments;
    }(1, 2), function(memo){
      return ok(memo === 1);
    });
    ok(reduce('123', function(a, b){
      a = +a;
      b = +b;
      return a + b;
    }) === 6);
    ok(reduce(function(){
      return arguments;
    }(1, 2, 3), function(a, b){
      return '' + b * b + a;
    }) === '941');
    ok(reduce('123', function(a, b){
      a = +a;
      b = +b;
      return a + b;
    }, 1) === 7);
  });
  test('.reduceRight', function(){
    var reduceRight, al, ctx;
    reduceRight = Array.reduceRight;
    reduceRight(al = function(){
      return arguments;
    }(1), function(memo, val, key, that){
      ok(memo === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    reduceRight(al = function(){
      return arguments;
    }(1, 2), function(memo){
      return ok(memo === 2);
    });
    ok(reduceRight('123', function(a, b){
      a = +a;
      b = +b;
      return a + b;
    }) === 6);
    ok(reduceRight(function(){
      return arguments;
    }(1, 2, 3), function(a, b){
      return '' + b * b + a;
    }) === '143');
    ok(reduceRight('123', function(a, b){
      a = +a;
      b = +b;
      return a + b;
    }, 1) === 7);
  });
  test('.fill', function(){
    var fill;
    fill = Array.fill;
    deepEqual(fill(Array(3), 5), [5, 5, 5]);
  });
  test('.find', function(){
    var find, al, ctx;
    find = Array.find;
    find(al = function(){
      return arguments;
    }(1), function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    ok(find(function(){
      return arguments;
    }(1, 3, NaN, 42, {}), (function(it){
      return it === 42;
    })) === 42);
    ok(find('123', (function(it){
      return it === '2';
    })) === '2');
    ok(find('123', (function(it){
      return it === '4';
    })) === void 8);
  });
  test('.findIndex', function(){
    var findIndex, al, ctx;
    findIndex = Array.findIndex;
    findIndex(al = function(){
      return arguments;
    }(1), function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    }, ctx = {});
    ok(findIndex(function(){
      return arguments;
    }(1, 3, NaN, 42, {}), (function(it){
      return it === 42;
    })) === 3);
    ok(findIndex('123', (function(it){
      return it === '2';
    })) === 1);
    ok(findIndex('123', (function(it){
      return it === '4';
    })) === -1);
  });
  test('.keys', function(){
    var keys, iter1, iter2;
    keys = Array.keys;
    ok(typeof keys === 'function', 'Is function');
    iter1 = keys(function(){
      return arguments;
    }('q', 'w', 'e'));
    ok(typeof iter1 === 'object', 'Iterator is object');
    ok(typeof iter1.next === 'function', 'Iterator has .next method');
    deepEqual(iter1.next(), {
      value: 0,
      done: false
    });
    deepEqual(iter1.next(), {
      value: 1,
      done: false
    });
    deepEqual(iter1.next(), {
      value: 2,
      done: false
    });
    deepEqual(iter1.next(), {
      value: void 8,
      done: true
    });
    iter2 = keys('qwe');
    deepEqual(iter2.next(), {
      value: 0,
      done: false
    });
    deepEqual(iter2.next(), {
      value: 1,
      done: false
    });
    deepEqual(iter2.next(), {
      value: 2,
      done: false
    });
    deepEqual(iter2.next(), {
      value: void 8,
      done: true
    });
  });
  test('.values', function(){
    var values, iter1, iter2;
    values = Array.values;
    ok(typeof values === 'function', 'Is function');
    iter1 = values(function(){
      return arguments;
    }('q', 'w', 'e'));
    ok(typeof iter1 === 'object', 'Iterator is object');
    ok(typeof iter1.next === 'function', 'Iterator has .next method');
    deepEqual(iter1.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter1.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter1.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter1.next(), {
      value: void 8,
      done: true
    });
    iter2 = values('qwe');
    deepEqual(iter2.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter2.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter2.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter2.next(), {
      value: void 8,
      done: true
    });
  });
  test('.entries', function(){
    var entries, iter1, iter2;
    entries = Array.entries;
    ok(typeof entries === 'function', 'Is function');
    iter1 = entries(function(){
      return arguments;
    }('q', 'w', 'e'));
    ok(typeof iter1 === 'object', 'Iterator is object');
    ok(typeof iter1.next === 'function', 'Iterator has .next method');
    deepEqual(iter1.next(), {
      value: [0, 'q'],
      done: false
    });
    deepEqual(iter1.next(), {
      value: [1, 'w'],
      done: false
    });
    deepEqual(iter1.next(), {
      value: [2, 'e'],
      done: false
    });
    deepEqual(iter1.next(), {
      value: void 8,
      done: true
    });
    iter2 = entries('qwe');
    deepEqual(iter2.next(), {
      value: [0, 'q'],
      done: false
    });
    deepEqual(iter2.next(), {
      value: [1, 'w'],
      done: false
    });
    deepEqual(iter2.next(), {
      value: [2, 'e'],
      done: false
    });
    deepEqual(iter2.next(), {
      value: void 8,
      done: true
    });
  });
  test('.turn', function(){
    var turn, al, obj;
    turn = Array.turn;
    turn(al = function(){
      return arguments;
    }(1), function(memo, val, key, that){
      deepEqual([], memo);
      ok(val === 1);
      ok(key === 0);
      return ok(that === al);
    });
    turn(al = '1', function(memo, val, key, that){
      deepEqual([], memo);
      ok(val === '1');
      ok(key === 0);
      return ok(that == al);
    });
    turn(function(){
      return arguments;
    }(1), function(it){
      return ok(it === obj);
    }, obj = {});
    deepEqual([3, 2, 1], turn(function(){
      return arguments;
    }(1, 2, 3), function(memo, it){
      return memo.unshift(it);
    }));
    deepEqual(['3', '2', '1'], turn('123', function(memo, it){
      return memo.unshift(it);
    }));
  });
  test('.contains', function(){
    var contains, args, o, str;
    contains = Array.contains;
    ok(isFunction(contains), 'Is function');
    args = function(){
      return arguments;
    }(1, 2, 3, -0, NaN, o = {});
    ok(contains(args, 1));
    ok(contains(args, -0));
    ok(contains(args, 0));
    ok(contains(args, NaN));
    ok(contains(args, o));
    ok(!contains(args, 4));
    ok(!contains(args, -0.5));
    ok(!contains(args, {}));
    str = 'qwe';
    ok(contains(str, 'q'));
    ok(!contains(str, 'r'));
  });
}).call(this);

(function(){
  var isFunction, DESC, slice, toString$ = {}.toString, slice$ = [].slice;
  QUnit.module('Binding');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  DESC = /\[native code\]\s*\}\s*$/.test(Object.defineProperty);
  slice = Array.prototype.slice;
  test('Function::by', function(){
    var $, array, push, foo, bar, o, fn;
    $ = _;
    ok(isFunction(Function.prototype.by), 'Is function');
    array = [1, 2, 3];
    push = array.push.by(array);
    ok(isFunction(push));
    ok(push(4) === 4);
    deepEqual(array, [1, 2, 3, 4]);
    foo = {
      bar: function(a, b, c, d){
        ok(this === foo);
        return deepEqual(slice.call(arguments), [1, 2, 3, 4]);
      }
    };
    bar = foo.bar.by(foo, 1, $, 3);
    bar(2, 4);
    o = {
      a: '1'
    };
    fn = function(b, c){
      return this.a + b + c;
    };
    ok(fn.by(o, '2')('3') === '123');
    ok(fn.by($)(o, '2', '3') === '123');
    ok(fn.by($, '2')(o, '3') === '123');
  });
  test('Function::part', function(){
    var obj, $, fn, part;
    ok(isFunction(Function.prototype.part), 'Is function');
    ok(function(it){
      return toString$.call(it).slice(8, -1) === 'String';
    }.part('qwe')());
    obj = {
      a: 42
    };
    obj.fn = function(it){
      return this.a + it;
    }.part(21);
    ok(obj.fn() === 63);
    $ = _;
    fn = function(){
      return Array.prototype.map.call(arguments, String).join(' ');
    };
    part = fn.part($, 'Саша', $, 'шоссе', $, 'сосала');
    ok(isFunction(part), '.part with placeholders return function');
    ok(part('Шла', 'по') === 'Шла Саша по шоссе undefined сосала', '.part with placeholders: args < placeholders');
    ok(part('Шла', 'по', 'и') === 'Шла Саша по шоссе и сосала', '.part with placeholders: args == placeholders');
    ok(part('Шла', 'по', 'и', 'сушку') === 'Шла Саша по шоссе и сосала сушку', '.part with placeholders: args > placeholders');
  });
  test('Function::only', function(){
    var fn, f, that, o, c;
    ok(isFunction(Function.prototype.only), 'Is function');
    fn = function(){
      var args;
      args = slice$.call(arguments);
      return args.reduce(curry$(function(x$, y$){
        return x$ + y$;
      }));
    };
    f = fn.only(2);
    ok(f(1, 2, 3) === 3);
    ok(f(1) === 1);
    that = function(){
      return this;
    };
    o = {
      f: that.only(1)
    };
    ok(o.f() === o);
    o = {
      f: that.only(1, c = {})
    };
    ok(o.f() === c);
  });
  test('::[_]', function(){
    var $, fn, ctx, array, push, foo, bar;
    $ = _;
    ok(isFunction(Object.prototype[_]), 'Object::[_] is function');
    fn = function(it){
      ok(this === ctx);
      return ok(it === 1);
    }[_]('call');
    fn(ctx = {}, 1);
    array = [1, 2, 3];
    push = array[_]('push');
    ok(isFunction(push));
    push(4, 5);
    deepEqual(array, [1, 2, 3, 4, 5]);
    ok([1, 2].every(/\d/[_]('test')));
    ok(![1, 'q'].every(/\d/[_]('test')));
    foo = {
      bar: function(a, b){
        ok(this === foo);
        return deepEqual(slice.call(arguments), [1, 2]);
      }
    };
    bar = foo[_]('bar');
    bar(1, 2);
  });
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);

(function(){
  var isFunction, isObject, methods, toString$ = {}.toString;
  QUnit.module('Console');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  isObject = function(it){
    return it === Object(it);
  };
  methods = ['assert', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupEnd', 'groupCollapsed', 'groupEnd', 'info', 'log', 'table', 'trace', 'warn', 'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp'];
  test('is object', function(){
    ok(isObject(((typeof global != 'undefined' && global !== null) && global || window).console), 'global.console is object');
  });
  test('console.#{..} are functions', function(){
    var i$, x$, ref$, len$;
    for (i$ = 0, len$ = (ref$ = methods).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(isFunction(console[x$]), "console." + x$ + " is function");
    }
  });
  test('call console.#{..}', function(){
    var i$, x$, ref$, len$;
    for (i$ = 0, len$ = (ref$ = methods).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok((fn$()), "call console." + x$);
    }
    function fn$(){
      try {
        console[x$]('foo');
        return true;
      } catch (e$) {}
    }
  });
  test('call unbound console.#{..}', function(){
    var i$, x$, ref$, len$;
    for (i$ = 0, len$ = (ref$ = methods).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok((fn$()), "call unbound console." + x$);
    }
    function fn$(){
      try {
        console[x$].call(void 8, 'foo');
        return true;
      } catch (e$) {}
    }
  });
  test('console as console.log shortcut', function(){
    ok(isFunction(console), 'console is function');
    ok(console === console.log, 'console is console.log shortcut');
    ok((function(){
      try {
        console('console');
        return true;
      } catch (e$) {}
    }()), 'call console');
  });
  test('console.{enable, disable}', function(){
    var enable, disable;
    enable = console.enable, disable = console.disable;
    ok(isFunction(enable), 'console.enable is function');
    ok(isFunction(disable), 'console.disable is function');
    ok((function(){
      try {
        disable();
        return true;
      } catch (e$) {}
    }()), 'disable console');
    ok((function(){
      try {
        return console('call disabled console') === void 8;
      } catch (e$) {}
    }()), 'call disabled console');
    ok((function(){
      try {
        enable();
        return true;
      } catch (e$) {}
    }()), 'enable console');
  });
}).call(this);

(function(){
  var isFunction, toString$ = {}.toString;
  QUnit.module('Date');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  test('.locale', function(){
    var locale;
    locale = core.locale;
    ok(isFunction(locale), 'Is function');
    locale('en');
    ok(locale() === 'en', '.locale() is "en"');
    ok(locale('ru') === 'ru', '.locale("ru") is "ru"');
    ok(locale() === 'ru', '.locale() is "ru"');
    ok(locale('xx') === 'ru', '.locale("xx") is "ru"');
  });
  test('.addLocale', function(){
    var locale, addLocale;
    locale = core.locale, addLocale = core.addLocale;
    ok(isFunction(locale), 'Is function');
    ok(locale('en') === 'en');
    ok(locale('zz') === 'en');
    addLocale('zz', {
      weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
      months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
    });
    ok(locale('zz') === 'zz');
    ok(new Date(1, 2, 3, 4, 5, 6, 7).format('W, D MM Y') === 'Воскресенье, 3 Марта 1901');
  });
  test('::format', function(){
    var locale, date;
    locale = core.locale;
    ok(isFunction(Date.prototype.format), 'Is function');
    date = new Date(1, 2, 3, 4, 5, 6, 7);
    ok(date.format('DD.NN.Y') === '03.03.1901', 'Works basic');
    locale('en');
    ok(date.format('s ss m mm h hh D DD W N NN M MM YY foo Y') === '6 06 5 05 4 04 3 03 Sunday 3 03 March March 01 foo 1901', 'Works with defaut locale');
    locale('ru');
    ok(date.format('s ss m mm h hh D DD W N NN M MM YY foo Y') === '6 06 5 05 4 04 3 03 Воскресенье 3 03 Март Марта 01 foo 1901', 'Works with set in Date.locale locale');
  });
  test('::formatUTC', function(){
    var date;
    ok(isFunction(Date.prototype.formatUTC), 'Is function');
    date = new Date(1, 2, 3, 4, 5, 6, 7);
    ok(date.formatUTC('h') === '' + date.getUTCHours(), 'Works');
  });
}).call(this);

(function(){
  var isFunction, keys, create, assign, from, toStringTag, toString$ = {}.toString;
  QUnit.module('Dict');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  keys = Object.keys, create = Object.create, assign = Object.assign;
  from = Array.from;
  toStringTag = Symbol.toStringTag;
  test('Dict', function(){
    var dict1, dict2, dict3;
    ok(isFunction(global.Dict), 'Is function');
    dict1 = Dict();
    ok(!(dict1 instanceof Object));
    deepEqual(keys(dict1), []);
    dict2 = Dict({
      q: 1,
      w: 2
    });
    ok(!(dict2 instanceof Object));
    deepEqual(keys(dict2), ['q', 'w']);
    ok(dict2.q === 1);
    ok(dict2.w === 2);
    dict3 = Dict(new Set([1, 2]).entries());
    ok(!(dict3 instanceof Object));
    deepEqual(keys(dict3), ['1', '2']);
    ok(dict3[1] === 1);
    ok(dict3[2] === 2);
  });
  test('.every', function(){
    var every, obj, ctx;
    every = Dict.every;
    ok(isFunction(every), 'Is function');
    every(obj = {
      q: 1
    }, function(val, key, that){
      ok(val === 1);
      ok(key === 'q');
      ok(that === obj);
      return ok(this === ctx);
    }, ctx = {});
    ok(every({
      q: 1,
      w: 2,
      e: 3
    }, function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
    ok(!every({
      q: 1,
      w: '2',
      e: 3
    }, function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
  });
  test('.filter', function(){
    var filter, obj, ctx;
    filter = Dict.filter;
    ok(isFunction(filter), 'Is function');
    filter(obj = {
      q: 1
    }, function(val, key, that){
      ok(val === 1);
      ok(key === 'q');
      ok(that === obj);
      return ok(this === ctx);
    }, ctx = {});
    deepEqual(filter({
      q: 1,
      w: 2,
      e: 3
    }, function(it){
      return it % 2;
    }), Dict({
      q: 1,
      e: 3
    }));
  });
  test('.find', function(){
    var find, obj, ctx;
    find = Dict.find;
    ok(isFunction(find), 'Is function');
    find(obj = {
      q: 1
    }, function(val, key, that){
      ok(val === 1);
      ok(key === 'q');
      ok(that === obj);
      return ok(this === ctx);
    }, ctx = {});
    ok(find({
      q: 1,
      w: 2,
      e: 3
    }, function(it){
      return !(it % 2);
    }) === 2);
  });
  test('.findKey', function(){
    var findKey, obj, ctx;
    findKey = Dict.findKey;
    ok(isFunction(findKey), 'Is function');
    findKey(obj = {
      q: 1
    }, function(val, key, that){
      ok(val === 1);
      ok(key === 'q');
      ok(that === obj);
      return ok(this === ctx);
    }, ctx = {});
    ok(findKey({
      q: 1,
      w: 2,
      e: 3
    }, function(it){
      return it === 2;
    }) === 'w');
  });
  test('.forEach', function(){
    var forEach, obj, ctx, rez;
    forEach = Dict.forEach;
    ok(isFunction(forEach), 'Is function');
    forEach(obj = {
      q: 1
    }, function(val, key, that){
      ok(val === 1);
      ok(key === 'q');
      ok(that === obj);
      ok(this === ctx);
    }, ctx = {});
    rez = {};
    forEach({
      q: 1,
      w: 2
    }, function(){
      rez[arguments[1]] = arguments[0] + this;
    }, '_');
    deepEqual(rez, {
      q: '1_',
      w: '2_'
    });
    rez = true;
    forEach(obj = {
      q: 1,
      w: 2
    }, function(){
      var rez;
      rez && (rez = obj === arguments[2]);
    });
    ok(rez);
    rez = {};
    forEach(Object.make({
      e: 3
    }, {
      q: 1,
      w: 2
    }), function(){
      rez[arguments[1]] = arguments[0];
    });
    ok(!('e' in rez));
    rez = {};
    forEach([1, 2], function(){
      rez[arguments[1]] = arguments[0];
    });
    ok(!('length' in rez));
    rez = {};
    forEach('123', function(){
      rez[arguments[1]] = arguments[0];
    });
    ok('2' in rez);
  });
  test('.keyOf', function(){
    var keyOf;
    keyOf = Dict.keyOf;
    ok(isFunction(keyOf), 'Is function');
    ok(keyOf({
      q: 1,
      w: 2,
      e: 3
    }, 2) === 'w');
    ok(keyOf({
      q: 1,
      w: 2,
      e: 3
    }, 4) === void 8);
    ok(keyOf({
      q: 1,
      w: 2,
      e: NaN
    }, NaN) === void 8);
  });
  test('.map', function(){
    var map, obj, ctx;
    map = Dict.map;
    ok(isFunction(map), 'Is function');
    map(obj = {
      q: 1
    }, function(val, key, that){
      ok(val === 1);
      ok(key === 'q');
      ok(that === obj);
      return ok(this === ctx);
    }, ctx = {});
    deepEqual(map({
      q: 1,
      w: 2,
      e: 3
    }, (function(it){
      return Math.pow(it, 2);
    })), Dict({
      q: 1,
      w: 4,
      e: 9
    }));
  });
  test('.reduce', function(){
    var reduce, obj, foo, memo;
    reduce = Dict.reduce;
    ok(isFunction(reduce), 'Is function');
    reduce(obj = {
      a: 1
    }, function(memo, val, key, that){
      ok(memo === foo);
      ok(val === 1);
      ok(key === 'a');
      return ok(that === obj);
    }, foo = {});
    reduce({
      a: 1,
      b: 2
    }, function(memo, val, key){
      ok(memo === 1);
      ok(val === 2);
      return ok(key === 'b');
    });
    reduce({
      q: 1,
      w: 2,
      e: 3
    }, function(that, it){
      that[it] = it;
      return that;
    }, memo = {});
    deepEqual(memo, {
      1: 1,
      2: 2,
      3: 3
    });
  });
  test('.some', function(){
    var some, obj, ctx;
    some = Dict.some;
    ok(isFunction(some), 'Is function');
    some(obj = {
      q: 1
    }, function(val, key, that){
      ok(val === 1);
      ok(key === 'q');
      ok(that === obj);
      return ok(this === ctx);
    }, ctx = {});
    ok(!some({
      q: 1,
      w: 2,
      e: 3
    }, function(it){
      return toString$.call(it).slice(8, -1) === 'String';
    }));
    ok(some({
      q: 1,
      w: '2',
      e: 3
    }, function(it){
      return toString$.call(it).slice(8, -1) === 'String';
    }));
  });
  test('.turn', function(){
    var turn, obj;
    turn = Dict.turn;
    ok(isFunction(turn), 'Is function');
    turn(obj = {
      q: 1
    }, function(memo, val, key, that){
      deepEqual(memo, Dict());
      ok(val === 1);
      ok(key === 'q');
      return ok(that === obj);
    });
    turn({
      q: 1
    }, function(it){
      return ok(it === obj);
    }, obj = {});
    deepEqual(turn({
      q: 1,
      w: 2,
      e: 3
    }, function(memo, it){
      return memo[it] = it;
    }), Dict({
      1: 1,
      2: 2,
      3: 3
    }));
  });
  test('.contains', function(){
    var contains, dict, o;
    contains = Dict.contains;
    ok(isFunction(contains), 'Is function');
    dict = {
      q: 1,
      w: NaN,
      e: -0,
      r: o = {}
    };
    ok(contains(dict, 1));
    ok(contains(dict, -0));
    ok(contains(dict, 0));
    ok(contains(dict, NaN));
    ok(contains(dict, o));
    ok(!contains(dict, 4));
    ok(!contains(dict, -0.5));
    ok(!contains(dict, {}));
  });
  test('.has', function(){
    var has;
    has = Dict.has;
    ok(isFunction(has), 'Is function');
    ok(has({
      q: 1
    }, 'q'));
    ok(!has({
      q: 1
    }, 'w'));
    ok(has([1], 0));
    ok(!has([], 0));
    ok(!has(clone$({
      q: 1
    }), 'q'));
    ok(!has({}, 'toString'));
  });
  test('.get', function(){
    var get;
    get = Dict.get;
    ok(isFunction(get), 'Is function');
    ok(get({
      q: 1
    }, 'q') === 1);
    ok(get({
      q: 1
    }, 'w') === void 8);
    ok(get([1], 0) === 1);
    ok(get([], 0) === void 8);
    ok(get(clone$({
      q: 1
    }), 'q') === void 8);
    ok(get({}, 'toString') === void 8);
  });
  test('.values', function(){
    var values, iter;
    values = Dict.values;
    ok(isFunction(values), 'Is function');
    iter = values({});
    ok(iter[toStringTag] === 'Dict Iterator');
    ok('next' in iter);
    deepEqual(from(values({
      q: 1,
      w: 2,
      e: 3
    })), [1, 2, 3]);
    deepEqual(from(values(new String('qwe'))), ['q', 'w', 'e']);
    deepEqual(from(values(assign(create({
      q: 1,
      w: 2,
      e: 3
    }), {
      a: 4,
      s: 5,
      d: 6
    }))), [4, 5, 6]);
  });
  test('.keys', function(){
    var keys, iter;
    keys = Dict.keys;
    ok(isFunction(keys), 'Is function');
    iter = keys({});
    ok(iter[toStringTag] === 'Dict Iterator');
    ok('next' in iter);
    deepEqual(from(keys({
      q: 1,
      w: 2,
      e: 3
    })), ['q', 'w', 'e']);
    deepEqual(from(keys(new String('qwe'))), ['0', '1', '2']);
    deepEqual(from(keys(assign(create({
      q: 1,
      w: 2,
      e: 3
    }), {
      a: 4,
      s: 5,
      d: 6
    }))), ['a', 's', 'd']);
  });
  test('.entries', function(){
    var entries, iter;
    entries = Dict.entries;
    ok(isFunction(entries), 'Is function');
    iter = entries({});
    ok(iter[toStringTag] === 'Dict Iterator');
    ok('next' in iter);
    deepEqual(from(entries({
      q: 1,
      w: 2,
      e: 3
    })), [['q', 1], ['w', 2], ['e', 3]]);
    deepEqual(from(entries(new String('qwe'))), [['0', 'q'], ['1', 'w'], ['2', 'e']]);
    deepEqual(from(entries(assign(create({
      q: 1,
      w: 2,
      e: 3
    }), {
      a: 4,
      s: 5,
      d: 6
    }))), [['a', 4], ['s', 5], ['d', 6]]);
  });
  test('Object.values', function(){
    var values;
    values = Object.values;
    ok(isFunction(values), 'Is function');
    deepEqual(values({
      q: 1,
      w: 2,
      e: 3
    }), [1, 2, 3]);
    deepEqual(values(new String('qwe')), ['q', 'w', 'e']);
    deepEqual(values(assign(create({
      q: 1,
      w: 2,
      e: 3
    }), {
      a: 4,
      s: 5,
      d: 6
    })), [4, 5, 6]);
  });
  test('Object.entries', function(){
    var entries;
    entries = Object.entries;
    ok(isFunction(entries), 'Is function');
    deepEqual(entries({
      q: 1,
      w: 2,
      e: 3
    }), [['q', 1], ['w', 2], ['e', 3]]);
    deepEqual(entries(new String('qwe')), [['0', 'q'], ['1', 'w'], ['2', 'e']]);
    deepEqual(entries(assign(create({
      q: 1,
      w: 2,
      e: 3
    }), {
      a: 4,
      s: 5,
      d: 6
    })), [['a', 4], ['s', 5], ['d', 6]]);
  });
  function clone$(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);

(function(){
  var isFunction, toString$ = {}.toString;
  QUnit.module('ES5');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  test('Object.getOwnPropertyDescriptor', function(){
    var getOwnPropertyDescriptor;
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    ok(isFunction(getOwnPropertyDescriptor), 'Is function');
    deepEqual(getOwnPropertyDescriptor({
      q: 42
    }, 'q'), {
      writable: true,
      enumerable: true,
      configurable: true,
      value: 42
    });
    ok(getOwnPropertyDescriptor({}, 'toString') === void 8);
  });
  test('Object.defineProperty', function(){
    var defineProperty, rez, src;
    defineProperty = Object.defineProperty;
    ok(isFunction(defineProperty), 'Is function');
    ok((rez = defineProperty(src = {}, 'q', {
      value: 42
    })) === src);
    ok(rez.q === 42);
  });
  test('Object.defineProperties', function(){
    var defineProperties, rez, src;
    defineProperties = Object.defineProperties;
    ok(isFunction(defineProperties), 'Is function');
    ok((rez = defineProperties(src = {}, {
      q: {
        value: 42
      },
      w: {
        value: 33
      }
    })) === src);
    ok(rez.q === 42) && rez.w === 33;
  });
  test('Object.getPrototypeOf', function(){
    var create, getPrototypeOf, fn, obj;
    create = Object.create, getPrototypeOf = Object.getPrototypeOf;
    ok(isFunction(getPrototypeOf), 'Is function');
    ok(getPrototypeOf({}) === Object.prototype);
    ok(getPrototypeOf([]) === Array.prototype);
    ok(getPrototypeOf(new (fn = (function(){
      fn.displayName = 'fn';
      var prototype = fn.prototype, constructor = fn;
      function fn(){}
      return fn;
    }()))) === fn.prototype);
    ok(getPrototypeOf(create(obj = {
      q: 1
    })) === obj);
    ok(getPrototypeOf(create(null)) === null);
    ok(getPrototypeOf(getPrototypeOf({})) === null);
  });
  test('Object.getOwnPropertyNames', function(){
    var getOwnPropertyNames, fn1, fn2;
    getOwnPropertyNames = Object.getOwnPropertyNames;
    ok(isFunction(getOwnPropertyNames), 'Is function');
    fn1 = function(w){
      this.w = w != null ? w : 2;
    };
    fn2 = function(toString){
      this.toString = toString != null ? toString : 2;
    };
    fn1.prototype.q = fn2.prototype.q = 1;
    deepEqual(getOwnPropertyNames([1, 2, 3]), ['0', '1', '2', 'length']);
    deepEqual(getOwnPropertyNames(new fn1(1)), ['w']);
    deepEqual(getOwnPropertyNames(new fn2(1)), ['toString']);
    ok(in$('toString', getOwnPropertyNames(Array.prototype)));
    ok(in$('toString', getOwnPropertyNames(Object.prototype)));
    ok(in$('constructor', getOwnPropertyNames(Object.prototype)));
  });
  test('Object.create', function(){
    var create, getPrototypeOf, getOwnPropertyNames, isObject, isPrototype, getPropertyNames, obj, fn;
    create = Object.create, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyNames = Object.getOwnPropertyNames;
    isObject = function(it){
      return it === Object(it);
    };
    isPrototype = function(a, b){
      return {}.isPrototypeOf.call(a, b);
    };
    getPropertyNames = function(object){
      var result, i$, x$, ref$, len$;
      result = getOwnPropertyNames(object);
      while (object = getPrototypeOf(object)) {
        for (i$ = 0, len$ = (ref$ = getOwnPropertyNames(object)).length; i$ < len$; ++i$) {
          x$ = ref$[i$];
          in$(x$, result) || result.push(x$);
        }
      }
      return result;
    };
    ok(isFunction(create), 'Is function');
    ok(isPrototype(obj = {
      q: 1
    }, create(obj)));
    ok(create(obj).q === 1);
    fn = function(){
      return this.a = 1;
    };
    ok(create(new fn) instanceof fn);
    ok(fn.prototype === getPrototypeOf(getPrototypeOf(create(new fn))));
    ok(create(new fn).a === 1);
    ok(create({}, {
      a: {
        value: 42
      }
    }).a === 42);
    ok(isObject(obj = create(null, {
      w: {
        value: 2
      }
    })));
    ok(!('toString' in obj));
    ok(obj.w === 2);
    deepEqual(getPropertyNames(create(null)), []);
  });
  test('Object.keys', function(){
    var keys, fn1, fn2;
    keys = Object.keys;
    ok(isFunction(keys), 'Is function');
    fn1 = function(w){
      this.w = w != null ? w : 2;
    };
    fn2 = function(toString){
      this.toString = toString != null ? toString : 2;
    };
    fn1.prototype.q = fn2.prototype.q = 1;
    deepEqual(keys([1, 2, 3]), ['0', '1', '2']);
    deepEqual(keys(new fn1(1)), ['w']);
    deepEqual(keys(new fn2(1)), ['toString']);
    ok(!in$('push', keys(Array.prototype)));
  });
  test('Function.prototype.bind', function(){
    var obj;
    ok(isFunction(Function.prototype.bind), 'Is function');
    obj = {
      a: 42
    };
    ok(42 === function(){
      return this.a;
    }.bind(obj)());
    ok(void 8 === new (function(){}.bind(obj))().a);
    ok(42 === function(it){
      return it;
    }.bind(null, 42)());
  });
  test('Array.isArray', function(){
    var isArray;
    isArray = Array.isArray;
    ok(isFunction(isArray), 'Is function');
    ok(!isArray({}));
    ok(!isArray(function(){
      return arguments;
    }()));
    ok(isArray([]));
  });
  test('ES5 Array prototype methods are functions', function(){
    var i$, x$, ref$, len$;
    for (i$ = 0, len$ = (ref$ = ['indexOf', 'lastIndexOf', 'every', 'some', 'forEach', 'map', 'filter', 'reduce', 'reduceRight']).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(isFunction(Array.prototype[x$]), "Array::" + x$ + " is function");
    }
  });
  test('Array::indexOf', function(){
    ok(0 === [1, 1, 1].indexOf(1));
    ok(-1 === [1, 2, 3].indexOf(1, 1));
    ok(1 === [1, 2, 3].indexOf(2, 1));
    ok(-1 === [NaN].indexOf(NaN));
    ok(3 === Array(2).concat([1, 2, 3]).indexOf(2));
    ok(-1 === Array(1).indexOf(void 8));
  });
  test('Array::lastIndexOf', function(){
    ok(2 === [1, 1, 1].lastIndexOf(1));
    ok(-1 === [1, 2, 3].lastIndexOf(3, 1));
    ok(1 === [1, 2, 3].lastIndexOf(2, 1));
    ok(-1 === [NaN].lastIndexOf(NaN));
    ok(1 === [1, 2, 3].concat(Array(2)).lastIndexOf(2));
  });
  test('Array::every', function(){
    var a, ctx, rez, arr;
    (a = [1]).every(function(val, key, that){
      ok(val === 1);
      ok(key === 0);
      ok(that === a);
      return ok(this === ctx);
    }, ctx = {});
    ok([1, 2, 3].every(function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
    ok([1, 2, 3].every((function(it){
      return it < 4;
    })));
    ok(![1, 2, 3].every((function(it){
      return it < 3;
    })));
    ok(![1, 2, 3].every(function(it){
      return toString$.call(it).slice(8, -1) === 'String';
    }));
    ok([1, 2, 3].every(function(){
      return +this === 1;
    }, 1));
    rez = '';
    [1, 2, 3].every(function(){
      return rez += arguments[1];
    });
    ok(rez === '012');
    ok((arr = [1, 2, 3]).every(function(){
      return arguments[2] === arr;
    }));
  });
  test('Array::some', function(){
    var a, ctx, rez, arr;
    (a = [1]).some(function(val, key, that){
      ok(val === 1);
      ok(key === 0);
      ok(that === a);
      return ok(this === ctx);
    }, ctx = {});
    ok([1, '2', 3].some(function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
    ok([1, 2, 3].some((function(it){
      return it < 3;
    })));
    ok(![1, 2, 3].some((function(it){
      return it < 0;
    })));
    ok(![1, 2, 3].some(function(it){
      return toString$.call(it).slice(8, -1) === 'String';
    }));
    ok(![1, 2, 3].some(function(){
      return +this !== 1;
    }, 1));
    rez = '';
    [1, 2, 3].some(function(){
      rez += arguments[1];
      return false;
    });
    ok(rez === '012');
    ok(!(arr = [1, 2, 3]).some(function(){
      return arguments[2] !== arr;
    }));
  });
  test('Array::forEach', function(){
    var a, ctx, rez, arr;
    (a = [1]).forEach(function(val, key, that){
      ok(val === 1);
      ok(key === 0);
      ok(that === a);
      ok(this === ctx);
    }, ctx = {});
    rez = '';
    [1, 2, 3].forEach(function(it){
      rez += it;
    });
    ok(rez === '123');
    rez = '';
    [1, 2, 3].forEach(function(){
      rez += arguments[1];
    });
    ok(rez === '012');
    rez = '';
    [1, 2, 3].forEach(function(){
      rez += arguments[2];
    });
    ok(rez === '1,2,31,2,31,2,3');
    rez = '';
    [1, 2, 3].forEach(function(){
      rez += this;
    }, 1);
    ok(rez === '111');
    rez = '';
    arr = [];
    arr[5] = '';
    arr.forEach(function(arg$, k){
      rez += k;
    });
    ok(rez === '5');
  });
  test('Array::map', function(){
    var a, ctx;
    (a = [1]).map(function(val, key, that){
      ok(val === 1);
      ok(key === 0);
      ok(that === a);
      return ok(this === ctx);
    }, ctx = {});
    deepEqual([2, 3, 4], [1, 2, 3].map((function(it){
      return it + 1;
    })));
    deepEqual([1, 3, 5], [1, 2, 3].map(curry$(function(x$, y$){
      return x$ + y$;
    })));
    deepEqual([2, 2, 2], [1, 2, 3].map(function(){
      return +this;
    }, 2));
  });
  test('Array::filter', function(){
    var a, ctx;
    (a = [1]).filter(function(val, key, that){
      ok(val === 1);
      ok(key === 0);
      ok(that === a);
      return ok(this === ctx);
    }, ctx = {});
    deepEqual([1, 2, 3, 4, 5], [1, 2, 3, 'q', {}, 4, true, 5].filter(function(it){
      return toString$.call(it).slice(8, -1) === 'Number';
    }));
  });
  test('Array::reduce', function(){
    var a;
    ok(-5 === [5, 4, 3, 2, 1].reduce(curry$(function(x$, y$){
      return x$ - y$;
    })));
    (a = [1]).reduce(function(memo, val, key, that){
      ok(memo === 42);
      ok(val === 1);
      ok(key === 0);
      return ok(that === a);
    }, 42);
    [42, 43].reduce(function(it){
      return ok(it === 42);
    });
  });
  test('Array::reduceRight', function(){
    var a;
    ok(-5 === [1, 2, 3, 4, 5].reduceRight(curry$(function(x$, y$){
      return x$ - y$;
    })));
    (a = [1]).reduceRight(function(memo, val, key, that){
      ok(memo === 42);
      ok(val === 1);
      ok(key === 0);
      return ok(that === a);
    }, 42);
    [42, 43].reduceRight(function(it){
      return ok(it === 43);
    });
  });
  test('String.prototype.trim', function(){
    ok(isFunction(String.prototype.trim), 'Is function');
    ok('   q w e \n  '.trim() === 'q w e', 'Remove whitespaces at left & right side of string');
  });
  test('Date.now', function(){
    var now;
    now = Date.now;
    ok(isFunction(now), 'Is function');
    ok(+new Date - now() < 10, 'Date.now() ~ +new Date');
  });
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);

(function(){
  var isFunction, isNative, getOwnPropertyDescriptor, defineProperty, same, epsilon, toString$ = {}.toString;
  QUnit.module('ES6');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  isNative = function(it){
    return /\[native code\]\s*\}\s*$/.test(it);
  };
  getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, defineProperty = Object.defineProperty;
  same = Object.is;
  epsilon = function(a, b, E){
    return Math.abs(a - b) <= (E != null ? E : 1e-11);
  };
  test('Object.assign', function(){
    var assign, foo;
    assign = Object.assign;
    ok(isFunction(assign), 'Is function');
    foo = {
      q: 1
    };
    ok(foo === assign(foo, {
      bar: 2
    }), 'assign return target');
    ok(foo.bar === 2, 'assign define properties');
    if (isNative(getOwnPropertyDescriptor)) {
      foo = {
        baz: 1
      };
      assign(foo, defineProperty({}, 'bar', {
        get: function(){
          return this.baz + 1;
        }
      }));
      ok(foo.bar === void 8, "assign don't copy descriptors");
    }
  });
  test('Object.is', function(){
    ok(isFunction(same), 'Is function');
    ok(same(1, 1), '1 is 1');
    ok(same(NaN, NaN), '1 is 1');
    ok(!same(0, -0), '0 isnt -0');
    ok(!same({}, {}), '{} isnt {}');
  });
  if (Object.setPrototypeOf) {
    test('Object.setPrototypeOf', function(){
      var setPrototypeOf, tmp;
      setPrototypeOf = Object.setPrototypeOf;
      ok(isFunction(setPrototypeOf), 'Is function');
      ok('apply' in setPrototypeOf({}, Function.prototype), 'Parent properties in target');
      ok(setPrototypeOf({
        a: 2
      }, {
        b: function(){
          return Math.pow(this.a, 2);
        }
      }).b() === 4, 'Child and parent properties in target');
      ok(setPrototypeOf(tmp = {}, {
        a: 1
      }) === tmp, 'setPrototypeOf return target');
      ok(!('toString' in setPrototypeOf({}, null)), 'Can set null as prototype');
    });
  }
  test('Number.EPSILON', function(){
    var EPSILON;
    EPSILON = Number.EPSILON;
    ok('EPSILON' in Number, 'EPSILON in Number');
    ok(EPSILON === Math.pow(2, -52), 'Is 2^-52');
    ok(1 !== 1 + EPSILON, '1 isnt 1 + EPSILON');
    ok(1 === 1 + EPSILON / 2, '1 is 1 + EPSILON / 2');
  });
  test('Number.isFinite', function(){
    var isFinite, i$, x$, ref$, len$, y$;
    isFinite = Number.isFinite;
    ok(isFunction(isFinite), 'Is function');
    for (i$ = 0, len$ = (ref$ = [1, 0.1, -1, Math.pow(2, 16), Math.pow(2, 16) - 1, Math.pow(2, 31), Math.pow(2, 31) - 1, Math.pow(2, 32), Math.pow(2, 32) - 1, -0]).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(isFinite(x$), "isFinite " + typeof x$ + " " + x$);
    }
    for (i$ = 0, len$ = (ref$ = [NaN, Infinity, 'NaN', '5', false, new Number(NaN), new Number(Infinity), new Number(5), new Number(0.1), void 8, null, {}, fn$]).length; i$ < len$; ++i$) {
      y$ = ref$[i$];
      ok(!isFinite(y$), "not isFinite " + typeof y$ + " " + y$);
    }
    function fn$(){}
  });
  test('Number.isInteger', function(){
    var isInteger, i$, x$, ref$, len$, y$;
    isInteger = Number.isInteger;
    ok(isFunction(isInteger), 'Is function');
    for (i$ = 0, len$ = (ref$ = [1, -1, Math.pow(2, 16), Math.pow(2, 16) - 1, Math.pow(2, 31), Math.pow(2, 31) - 1, Math.pow(2, 32), Math.pow(2, 32) - 1, -0]).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(isInteger(x$), "isInteger " + typeof x$ + " " + x$);
    }
    for (i$ = 0, len$ = (ref$ = [NaN, 0.1, Infinity, 'NaN', '5', false, new Number(NaN), new Number(Infinity), new Number(5), new Number(0.1), void 8, null, {}, fn$]).length; i$ < len$; ++i$) {
      y$ = ref$[i$];
      ok(!isInteger(y$), "not isInteger " + typeof y$ + " " + y$);
    }
    function fn$(){}
  });
  test('Number.isNaN', function(){
    var isNaN, i$, x$, ref$, len$;
    isNaN = Number.isNaN;
    ok(isFunction(isNaN), 'Is function');
    ok(isNaN(NaN), 'Number.isNaN NaN');
    for (i$ = 0, len$ = (ref$ = [1, 0.1, -1, Math.pow(2, 16), Math.pow(2, 16) - 1, Math.pow(2, 31), Math.pow(2, 31) - 1, Math.pow(2, 32), Math.pow(2, 32) - 1, -0, Infinity, 'NaN', '5', false, new Number(NaN), new Number(Infinity), new Number(5), new Number(0.1), void 8, null, {}, fn$]).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(!isNaN(x$), "not Number.isNaN " + typeof x$ + " " + x$);
    }
    function fn$(){}
  });
  test('Number.isSafeInteger', function(){
    var isSafeInteger, i$, x$, ref$, len$, y$;
    isSafeInteger = Number.isSafeInteger;
    ok(isFunction(isSafeInteger), 'Is function');
    for (i$ = 0, len$ = (ref$ = [1, -1, Math.pow(2, 16), Math.pow(2, 16) - 1, Math.pow(2, 31), Math.pow(2, 31) - 1, Math.pow(2, 32), Math.pow(2, 32) - 1, -0, 9007199254740991, -9007199254740991]).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(isSafeInteger(x$), "isSafeInteger " + typeof x$ + " " + x$);
    }
    for (i$ = 0, len$ = (ref$ = [9007199254740992, -9007199254740992, NaN, 0.1, Infinity, 'NaN', '5', false, new Number(NaN), new Number(Infinity), new Number(5), new Number(0.1), void 8, null, {}, fn$]).length; i$ < len$; ++i$) {
      y$ = ref$[i$];
      ok(!isSafeInteger(y$), "not isSafeInteger " + typeof y$ + " " + y$);
    }
    function fn$(){}
  });
  test('Number.MAX_SAFE_INTEGER', function(){
    ok(Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1, 'Is 2^53 - 1');
  });
  test('Number.MIN_SAFE_INTEGER', function(){
    ok(Number.MIN_SAFE_INTEGER === -Math.pow(2, 53) + 1, 'Is -2^53 + 1');
  });
  test('Number.parseFloat', function(){
    ok(isFunction(Number.parseFloat), 'Is function');
  });
  test('Number.parseInt', function(){
    ok(isFunction(Number.parseInt), 'Is function');
  });
  test('Math.acosh', function(){
    var acosh;
    acosh = Math.acosh;
    ok(isFunction(acosh), 'Is function');
    ok(same(acosh(NaN), NaN));
    ok(same(acosh(0.5), NaN));
    ok(same(acosh(-1), NaN));
    ok(same(acosh(1), 0));
    ok(same(acosh(Infinity), Infinity));
    ok(epsilon(acosh(1234), 7.811163220849231));
    ok(epsilon(acosh(8.88), 2.8737631531629235));
  });
  test('Math.asinh', function(){
    var asinh;
    asinh = Math.asinh;
    ok(isFunction(asinh), 'Is function');
    ok(same(asinh(NaN), NaN));
    ok(same(asinh(0), 0));
    ok(same(asinh(-0), -0));
    ok(same(asinh(Infinity), Infinity));
    ok(same(asinh(-Infinity), -Infinity));
    ok(epsilon(asinh(1234), 7.811163549201245));
    ok(epsilon(asinh(9.99), 2.997227420191335));
    ok(epsilon(asinh(1e150), 346.0809111296668));
    ok(epsilon(asinh(1e7), 16.811242831518268));
    ok(epsilon(asinh(-1e7), -16.811242831518268));
  });
  test('Math.atanh', function(){
    var atanh;
    atanh = Math.atanh;
    ok(isFunction(atanh), 'Is function');
    ok(same(atanh(NaN), NaN));
    ok(same(atanh(-2), NaN));
    ok(same(atanh(-1.5), NaN));
    ok(same(atanh(2), NaN));
    ok(same(atanh(1.5), NaN));
    ok(same(atanh(-1), -Infinity));
    ok(same(atanh(1), Infinity));
    ok(same(atanh(0), 0));
    ok(same(atanh(-0), -0));
    ok(same(atanh(-1e300), NaN));
    ok(same(atanh(1e300), NaN));
    ok(epsilon(atanh(0.5), 0.5493061443340549));
    ok(epsilon(atanh(-0.5), -0.5493061443340549));
    ok(epsilon(atanh(0.444), 0.47720201260109457));
  });
  test('Math.cbrt', function(){
    var cbrt;
    cbrt = Math.cbrt;
    ok(isFunction(cbrt), 'Is function');
    ok(same(cbrt(NaN), NaN));
    ok(same(cbrt(0), 0));
    ok(same(cbrt(-0), -0));
    ok(same(cbrt(Infinity), Infinity));
    ok(same(cbrt(-Infinity), -Infinity));
    ok(same(cbrt(-8), -2));
    ok(same(cbrt(8), 2));
    ok(epsilon(cbrt(-1000), -10));
    ok(epsilon(cbrt(1000), 10));
  });
  test('Math.clz32', function(){
    var clz32;
    clz32 = Math.clz32;
    ok(isFunction(clz32), 'Is function');
    ok(clz32(0) === 32);
    ok(clz32(1) === 31);
    ok(clz32(-1) === 0);
    ok(clz32(0.6) === 32);
    ok(clz32(Math.pow(2, 32) - 1) === 0);
    ok(clz32(Math.pow(2, 32)) === 32);
  });
  test('Math.cosh', function(){
    var cosh;
    cosh = Math.cosh;
    ok(isFunction(cosh), 'Is function');
    ok(same(cosh(NaN), NaN));
    ok(same(cosh(0), 1));
    ok(same(cosh(-0), 1));
    ok(same(cosh(Infinity), Infinity));
    ok(epsilon(cosh(12), 81377.39571257407, 3e-11));
    ok(epsilon(cosh(22), 1792456423.065795780980053377, 1e-5));
    ok(epsilon(cosh(-10), 11013.23292010332313972137));
    ok(epsilon(cosh(-23), 4872401723.1244513000, 1e-5));
  });
  test('Math.expm1', function(){
    var expm1;
    expm1 = Math.expm1;
    ok(isFunction(expm1), 'Is function');
    ok(same(expm1(NaN), NaN));
    ok(same(expm1(0), 0));
    ok(same(expm1(-0), -0));
    ok(same(expm1(Infinity), Infinity));
    ok(same(expm1(-Infinity), -1));
    ok(epsilon(expm1(10), 22025.465794806718, ok(epsilon(expm1(-10), -0.9999546000702375))));
  });
  test('Math.hypot', function(){
    var hypot, sqrt;
    hypot = Math.hypot, sqrt = Math.sqrt;
    ok(isFunction(hypot), 'Is function');
    ok(same(hypot('', 0), 0));
    ok(same(hypot(0, ''), 0));
    ok(same(hypot(Infinity, 0), Infinity));
    ok(same(hypot(-Infinity, 0), Infinity));
    ok(same(hypot(0, Infinity), Infinity));
    ok(same(hypot(0, -Infinity), Infinity));
    ok(same(hypot(Infinity, NaN), Infinity));
    ok(same(hypot(NaN, -Infinity), Infinity));
    ok(same(hypot(NaN, 0), NaN));
    ok(same(hypot(0, NaN), NaN));
    ok(same(hypot(0, -0), 0));
    ok(same(hypot(0, 0), 0));
    ok(same(hypot(-0, -0), 0));
    ok(same(hypot(-0, 0), 0));
    ok(same(hypot(0, 1), 1));
    ok(same(hypot(0, -1), 1));
    ok(same(hypot(-0, 1), 1));
    ok(same(hypot(-0, -1), 1));
    ok(same(hypot(0), 0));
    ok(same(hypot(1), 1));
    ok(same(hypot(2), 2));
    ok(same(hypot(0, 0, 1), 1));
    ok(same(hypot(0, 1, 0), 1));
    ok(same(hypot(1, 0, 0), 1));
    ok(same(hypot(2, 3, 4), sqrt(2 * 2 + 3 * 3 + 4 * 4)));
    ok(same(hypot(2, 3, 4, 5), sqrt(2 * 2 + 3 * 3 + 4 * 4 + 5 * 5)));
    ok(epsilon(hypot(66, 66), 93.33809511662427));
    ok(epsilon(hypot(0.1, 100), 100.0000499999875));
  });
  test('Math.imul', function(){
    var imul;
    imul = Math.imul;
    ok(isFunction(imul), 'Is function');
    ok(same(imul(0, 0), 0));
    ok(imul(123, 456) === 56088);
    ok(imul(-123, 456) === -56088);
    ok(imul(123, -456) === -56088);
    ok(imul(19088743, 4275878552) === 602016552);
    ok(imul(false, 7) === 0);
    ok(imul(7, false) === 0);
    ok(imul(false, false) === 0);
    ok(imul(true, 7) === 7);
    ok(imul(7, true) === 7);
    ok(imul(true, true) === 1);
    ok(imul(void 8, 7) === 0);
    ok(imul(7, void 8) === 0);
    ok(imul(void 8, void 8) === 0);
    ok(imul('str', 7) === 0);
    ok(imul(7, 'str') === 0);
    ok(imul({}, 7) === 0);
    ok(imul(7, {}) === 0);
    ok(imul([], 7) === 0);
    ok(imul(7, []) === 0);
    ok(imul(0xffffffff, 5) === -5);
    ok(imul(0xfffffffe, 5) === -10);
    ok(imul(2, 4) === 8);
    ok(imul(-1, 8) === -8);
    ok(imul(-2, -2) === 4);
    ok(imul(-0, 7) === 0);
    ok(imul(7, -0) === 0);
    ok(imul(0.1, 7) === 0);
    ok(imul(7, 0.1) === 0);
    ok(imul(0.9, 7) === 0);
    ok(imul(7, 0.9) === 0);
    ok(imul(1.1, 7) === 7);
    ok(imul(7, 1.1) === 7);
    ok(imul(1.9, 7) === 7);
    ok(imul(7, 1.9) === 7);
  });
  test('Math.log1p', function(){
    var log1p;
    log1p = Math.log1p;
    ok(isFunction(log1p), 'Is function');
    ok(same(log1p(''), log1p(0)));
    ok(same(log1p(NaN), NaN));
    ok(same(log1p(-2), NaN));
    ok(same(log1p(-1), -Infinity));
    ok(same(log1p(0), 0));
    ok(same(log1p(-0), -0));
    ok(same(log1p(Infinity), Infinity));
    ok(epsilon(log1p(5), 1.791759469228055));
    ok(epsilon(log1p(50), 3.9318256327243257));
  });
  test('Math.log10', function(){
    var log10;
    log10 = Math.log10;
    ok(isFunction(log10), 'Is function');
    ok(same(log10(''), log10(0)));
    ok(same(log10(NaN), NaN));
    ok(same(log10(-1), NaN));
    ok(same(log10(0), -Infinity));
    ok(same(log10(-0), -Infinity));
    ok(same(log10(1), 0));
    ok(same(log10(Infinity), Infinity));
    ok(epsilon(log10(0.1), -1));
    ok(epsilon(log10(0.5), -0.3010299956639812));
    ok(epsilon(log10(1.5), 0.17609125905568124));
    ok(epsilon(log10(5), 0.6989700043360189));
    ok(epsilon(log10(50), 1.6989700043360187));
  });
  test('Math.log2', function(){
    var log2;
    log2 = Math.log2;
    ok(isFunction(log2), 'Is function');
    ok(same(log2(''), log2(0)));
    ok(same(log2(NaN), NaN));
    ok(same(log2(-1), NaN));
    ok(same(log2(0), -Infinity));
    ok(same(log2(-0), -Infinity));
    ok(same(log2(1), 0));
    ok(same(log2(Infinity), Infinity));
    ok(same(log2(0.5), -1));
    ok(same(log2(32), 5));
    ok(epsilon(log2(5), 2.321928094887362));
  });
  test('Math.sign', function(){
    var sign;
    sign = Math.sign;
    ok(isFunction(sign), 'Is function');
    ok(same(sign(NaN), NaN));
    ok(same(sign(), NaN));
    ok(same(sign(-0), -0));
    ok(same(sign(0), 0));
    ok(same(sign(Infinity), 1));
    ok(same(sign(-Infinity), -1));
    ok(sign(13510798882111488) === 1);
    ok(sign(-13510798882111488) === -1);
    ok(sign(42.5) === 1);
    ok(sign(-42.5) === -1);
  });
  test('Math.sinh', function(){
    var sinh;
    sinh = Math.sinh;
    ok(isFunction(sinh), 'Is function');
    ok(same(sinh(NaN), NaN));
    ok(same(sinh(0), 0));
    ok(same(sinh(-0), -0));
    ok(same(sinh(Infinity), Infinity));
    ok(same(sinh(-Infinity), -Infinity));
    ok(epsilon(sinh(-5), -74.20321057778875));
    ok(epsilon(sinh(2), 3.6268604078470186));
  });
  test('Math.tanh', function(){
    var tanh;
    tanh = Math.tanh;
    ok(isFunction(tanh), 'Is function');
    ok(same(tanh(NaN), NaN));
    ok(same(tanh(0), 0));
    ok(same(tanh(-0), -0));
    ok(same(tanh(Infinity), 1));
    ok(same(tanh(90), 1));
    ok(epsilon(tanh(10), 0.9999999958776927));
  });
  test('Math.trunc', function(){
    var trunc;
    trunc = Math.trunc;
    ok(isFunction(trunc), 'Is function');
    ok(same(trunc(NaN), NaN), 'NaN -> NaN');
    ok(same(trunc(-0), -0), '-0 -> -0');
    ok(same(trunc(0), 0), '0 -> 0');
    ok(same(trunc(Infinity), Infinity), 'Infinity -> Infinity');
    ok(same(trunc(-Infinity), -Infinity), '-Infinity -> -Infinity');
    ok(same(trunc(null), 0), 'null -> 0');
    ok(same(trunc({}), NaN), '{} -> NaN');
    ok(trunc([]) === 0, '[] -> 0');
    ok(trunc(1.01) === 1, '1.01 -> 0');
    ok(trunc(1.99) === 1, '1.99 -> 0');
    ok(trunc(-1) === -1, '-1 -> -1');
    ok(trunc(-1.99) === -1, '-1.99 -> -1');
    ok(trunc(-555.555) === -555, '-555.555 -> -555');
    ok(trunc(0x20000000000001) === 0x20000000000001, '0x20000000000001 -> 0x20000000000001');
    ok(trunc(-0x20000000000001) === -0x20000000000001, '-0x20000000000001 -> -0x20000000000001');
  });
  test('String::contains', function(){
    ok(isFunction(String.prototype.contains), 'Is function');
    ok(!'abc'.contains());
    ok('aundefinedb'.contains());
    ok('abcd'.contains('b', 1));
    ok(!'abcd'.contains('b', 2));
  });
  test('String::endsWith', function(){
    ok(isFunction(String.prototype.endsWith), 'Is function');
    ok('undefined'.endsWith());
    ok(!'undefined'.endsWith(null));
    ok('abc'.endsWith(''));
    ok('abc'.endsWith('c'));
    ok('abc'.endsWith('bc'));
    ok(!'abc'.endsWith('ab'));
    ok('abc'.endsWith('', NaN));
    ok(!'abc'.endsWith('c', -1));
    ok('abc'.endsWith('a', 1));
    ok('abc'.endsWith('c', Infinity));
    ok('abc'.endsWith('a', true));
    ok(!'abc'.endsWith('c', 'x'));
    ok(!'abc'.endsWith('a', 'x'));
  });
  test('String::repeat', function(){
    var e;
    ok(isFunction(String.prototype.repeat), 'Is function');
    ok('qwe'.repeat(3) === 'qweqweqwe');
    ok('qwe'.repeat(2.5) === 'qweqwe');
    try {
      'qwe'.repeat(-1);
      ok(false);
    } catch (e$) {
      e = e$;
      ok(true);
    }
  });
  test('String::startsWith', function(){
    ok(isFunction(String.prototype.startsWith), 'Is function');
    ok('undefined'.startsWith());
    ok(!'undefined'.startsWith(null));
    ok('abc'.startsWith(''));
    ok('abc'.startsWith('a'));
    ok('abc'.startsWith('ab'));
    ok(!'abc'.startsWith('bc'));
    ok('abc'.startsWith('', NaN));
    ok('abc'.startsWith('a', -1));
    ok(!'abc'.startsWith('a', 1));
    ok(!'abc'.startsWith('a', Infinity));
    ok('abc'.startsWith('b', true));
    ok('abc'.startsWith('a', 'x'));
  });
  test('Array.from', function(){
    var from, al, ctx;
    from = Array.from;
    ok(isFunction(from), 'Is function');
    deepEqual(from('123'), ['1', '2', '3']);
    deepEqual(from({
      length: 3,
      0: 1,
      1: 2,
      2: 3
    }), [1, 2, 3]);
    from(al = function(){
      return arguments;
    }(1), function(val, key){
      ok(this === ctx);
      ok(val === 1);
      return ok(key === 0);
    }, ctx = {});
    from([1], function(val, key){
      ok(this === ctx);
      ok(val === 1);
      return ok(key === 0);
    }, ctx = {});
    deepEqual(from({
      length: 3,
      0: 1,
      1: 2,
      2: 3
    }, (function(it){
      return Math.pow(it, 2);
    })), [1, 4, 9]);
    deepEqual(from(new Set([1, 2, 3, 2, 1])), [1, 2, 3], 'Works with iterators');
  });
  test('Array.of', function(){
    ok(isFunction(Array.of), 'Is function');
    deepEqual(Array.of(1), [1]);
    deepEqual(Array.of(1, 2, 3), [1, 2, 3]);
  });
  test('Array::fill', function(){
    ok(isFunction(Array.prototype.fill), 'Is function');
    deepEqual(Array(5).fill(5), [5, 5, 5, 5, 5]);
    deepEqual(Array(5).fill(5, 1), [void 8, 5, 5, 5, 5]);
    deepEqual(Array(5).fill(5, 1, 4), [void 8, 5, 5, 5, void 8]);
    deepEqual(Array(5).fill(5, 6, 1), [void 8, void 8, void 8, void 8, void 8]);
    deepEqual(Array(5).fill(5, -3, 4), [void 8, void 8, 5, 5, void 8]);
  });
  test('Array::find', function(){
    var arr, ctx;
    ok(isFunction(Array.prototype.find), 'Is function');
    (arr = [1]).find(function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === arr);
    }, ctx = {});
    ok([1, 3, NaN, 42, {}].find((function(it){
      return it === 42;
    })) === 42);
    ok([1, 3, NaN, 42, {}].find((function(it){
      return it === 43;
    })) === void 8);
  });
  test('Array::findIndex', function(){
    var arr, ctx;
    ok(isFunction(Array.prototype.findIndex), 'Is function');
    (arr = [1]).findIndex(function(val, key, that){
      ok(this === ctx);
      ok(val === 1);
      ok(key === 0);
      return ok(that === arr);
    }, ctx = {});
    ok([1, 3, NaN, 42, {}].findIndex((function(it){
      return it === 42;
    })) === 3);
  });
}).call(this);

(function(){
  var isFunction, isNative, getOwnPropertyDescriptor, that, toString$ = {}.toString;
  QUnit.module('ES6 Collections');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  isNative = function(it){
    return /\[native code\]\s*\}\s*$/.test(it);
  };
  getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  that = (typeof global != 'undefined' && global !== null) && global || window;
  test('Map', function(){
    ok(isFunction(that.Map), 'Is function');
    ok('clear' in Map.prototype, 'clear in Map.prototype');
    ok('delete' in Map.prototype, 'delete in Map.prototype');
    ok('forEach' in Map.prototype, 'forEach in Map.prototype');
    ok('get' in Map.prototype, 'get in Map.prototype');
    ok('has' in Map.prototype, 'has in Map.prototype');
    ok('set' in Map.prototype, 'set in Map.prototype');
    ok(new Map instanceof Map, 'new Map instanceof Map');
    ok(new Map([1, 2, 3].entries()).size === 3, 'Init from iterator #1');
    ok(new Map(new Map([1, 2, 3].entries())).size === 3, 'Init from iterator #2');
  });
  test('Map::clear', function(){
    var M;
    ok(isFunction(Map.prototype.clear), 'Is function');
    M = new Map().set(1, 2).set(2, 3).set(1, 4);
    M.clear();
    ok(M.size === 0);
  });
  test('Map::delete', function(){
    var a, M;
    ok(isFunction(Map.prototype['delete']), 'Is function');
    a = [];
    M = new Map().set(NaN, 1).set(2, 1).set(3, 1).set(2, 5).set(1, 4).set(a, {});
    ok(M.size === 5);
    ok(M['delete'](NaN) === true);
    ok(M.size === 4);
    ok(M['delete'](4) === false);
    ok(M.size === 4);
    M['delete']([]);
    ok(M.size === 4);
    M['delete'](a);
    ok(M.size === 3);
  });
  test('Map::forEach', function(){
    var r, T, count, M, a, map, s;
    ok(isFunction(Map.prototype.forEach), 'Is function');
    r = {};
    count = 0;
    M = new Map().set(NaN, 1).set(2, 1).set(3, 7).set(2, 5).set(1, 4).set(a = {}, 9);
    M.forEach(function(value, key){
      count++;
      r[value] = key;
    });
    ok(count === 5);
    deepEqual(r, {
      1: NaN,
      7: 3,
      5: 2,
      4: 1,
      9: a
    });
    map = new Map([['0', 9], ['1', 9], ['2', 9], ['3', 9]]);
    s = "";
    map.forEach(function(value, key){
      s += key;
      if (key === '2') {
        map['delete']('2');
        map['delete']('3');
        map['delete']('1');
        return map.set('4', 9);
      }
    });
    ok(s === '0124');
  });
  test('Map::get', function(){
    var o, M;
    ok(isFunction(Map.prototype.get), 'Is function');
    o = {};
    M = new Map().set(NaN, 1).set(2, 1).set(3, 1).set(2, 5).set(1, 4).set(o, o);
    ok(M.get(NaN) === 1);
    ok(M.get(4) === void 8);
    ok(M.get({}) === void 8);
    ok(M.get(o) === o);
    ok(M.get(2) === 5);
  });
  test('Map::has', function(){
    var o, M;
    ok(isFunction(Map.prototype.has), 'Is function');
    o = {};
    M = new Map().set(NaN, 1).set(2, 1).set(3, 1).set(2, 5).set(1, 4).set(o, o);
    ok(M.has(NaN));
    ok(M.has(o));
    ok(M.has(2));
    ok(!M.has(4));
    ok(!M.has({}));
  });
  test('Map::set', function(){
    var o, M, chain;
    ok(isFunction(Map.prototype.set), 'Is function');
    o = {};
    M = new Map().set(NaN, 1).set(2, 1).set(3, 1).set(2, 5).set(1, 4).set(o, o);
    ok(M.size === 5);
    chain = M.set(7, 2);
    ok(chain === M);
    M.set(7, 2);
    ok(M.size === 6);
    ok(M.get(7) === 2);
    ok(M.get(NaN) === 1);
    M.set(NaN, 42);
    ok(M.size === 6);
    ok(M.get(NaN) === 42);
    M.set({}, 11);
    ok(M.size === 7);
    ok(M.get(o) === o);
    M.set(o, 27);
    ok(M.size === 7);
    ok(M.get(o) === 27);
    ok(new Map().set(NaN, 2).set(NaN, 3).set(NaN, 4).size === 1);
  });
  test('Map::size', function(){
    var size, sizeDesc;
    size = new Map().set(2, 1).size;
    ok(typeof size === 'number', 'size is number');
    ok(size === 1, 'size is correct');
    if (isNative(getOwnPropertyDescriptor)) {
      sizeDesc = getOwnPropertyDescriptor(Map.prototype, 'size');
      ok(sizeDesc && sizeDesc.get, 'size is getter');
      ok(sizeDesc && !sizeDesc.set, 'size isnt setter');
    }
  });
  test('Map::@@toStringTag', function(){
    ok(Map.prototype[Symbol.toStringTag] === 'Map', 'Map::@@toStringTag is `Map`');
  });
  test('Set', function(){
    var S, r;
    ok(isFunction(that.Set), 'Is function');
    ok('add' in Set.prototype, 'add in Set.prototype');
    ok('clear' in Set.prototype, 'clear in Set.prototype');
    ok('delete' in Set.prototype, 'delete in Set.prototype');
    ok('forEach' in Set.prototype, 'forEach in Set.prototype');
    ok('has' in Set.prototype, 'has in Set.prototype');
    ok(new Set instanceof Set, 'new Set instanceof Set');
    ok(new Set([1, 2, 3, 2, 1].values()).size === 3, 'Init from iterator #1');
    ok(new Set([1, 2, 3, 2, 1]).size === 3, 'Init Set from iterator #2');
    S = new Set([1, 2, 3, 2, 1]);
    ok(S.size === 3);
    r = [];
    S.forEach(function(v){
      return r.push(v);
    });
    deepEqual(r, [1, 2, 3]);
    ok(new Set([NaN, NaN, NaN]).size === 1);
    if (Array.from) {
      deepEqual(Array.from(new Set([3, 4]).add(2).add(1)), [3, 4, 2, 1]);
    }
  });
  test('Set::add', function(){
    var a, S, chain;
    ok(isFunction(Set.prototype.add), 'Is function');
    a = [];
    S = new Set([NaN, 2, 3, 2, 1, a]);
    ok(S.size === 5);
    chain = S.add(NaN);
    ok(chain === S);
    ok(S.size === 5);
    S.add(2);
    ok(S.size === 5);
    S.add(a);
    ok(S.size === 5);
    S.add([]);
    ok(S.size === 6);
    S.add(4);
    ok(S.size === 7);
  });
  test('Set::clear', function(){
    var S;
    ok(isFunction(Set.prototype.clear), 'Is function');
    S = new Set([1, 2, 3, 2, 1]);
    S.clear();
    ok(S.size === 0);
  });
  test('Set::delete', function(){
    var a, S;
    ok(isFunction(Set.prototype['delete']), 'Is function');
    a = [];
    S = new Set([NaN, 2, 3, 2, 1, a]);
    ok(S.size === 5);
    ok(S['delete'](NaN) === true);
    ok(S.size === 4);
    ok(S['delete'](4) === false);
    ok(S.size === 4);
    S['delete']([]);
    ok(S.size === 4);
    S['delete'](a);
    ok(S.size === 3);
  });
  test('Set::forEach', function(){
    var r, count, S, set, s;
    ok(isFunction(Set.prototype.forEach), 'Is function');
    r = [];
    count = 0;
    S = new Set([1, 2, 3, 2, 1]);
    S.forEach(function(value){
      count++;
      r.push(value);
    });
    ok(count === 3);
    deepEqual(r, [1, 2, 3]);
    set = new Set(['0', '1', '2', '3']);
    s = "";
    set.forEach(function(it){
      s += it;
      if (it === '2') {
        set['delete']('2');
        set['delete']('3');
        set['delete']('1');
        return set.add('4');
      }
    });
    ok(s === '0124');
  });
  test('Set::has', function(){
    var a, S;
    ok(isFunction(Set.prototype.has), 'Is function');
    a = [];
    S = new Set([NaN, 2, 3, 2, 1, a]);
    ok(S.has(NaN));
    ok(S.has(a));
    ok(S.has(2));
    ok(!S.has(4));
    ok(!S.has([]));
  });
  test('Set::size', function(){
    var size, sizeDesc;
    size = new Set([1]).size;
    ok(typeof size === 'number', 'size is number');
    ok(size === 1, 'size is correct');
    if (isNative(getOwnPropertyDescriptor)) {
      sizeDesc = getOwnPropertyDescriptor(Set.prototype, 'size');
      ok(sizeDesc && sizeDesc.get, 'size is getter');
      ok(sizeDesc && !sizeDesc.set, 'size isnt setter');
    }
  });
  test('Set::@@toStringTag', function(){
    ok(Set.prototype[Symbol.toStringTag] === 'Set', 'Set::@@toStringTag is `Set`');
  });
  test('WeakMap', function(){
    var a, b;
    ok(isFunction(that.WeakMap), 'Is function');
    ok('clear' in WeakMap.prototype, 'clear in WeakMap.prototype');
    ok('delete' in WeakMap.prototype, 'delete in WeakMap.prototype');
    ok('get' in WeakMap.prototype, 'get in WeakMap.prototype');
    ok('has' in WeakMap.prototype, 'has in WeakMap.prototype');
    ok('set' in WeakMap.prototype, 'set in WeakMap.prototype');
    ok(new WeakMap instanceof WeakMap, 'new WeakMap instanceof WeakMap');
    ok(new WeakMap([[a = {}, b = {}]].values()).get(a) === b, 'Init WeakMap from iterator #1');
    ok(new WeakMap(new Map([[a = {}, b = {}]])).get(a) === b, 'Init WeakMap from iterator #2');
  });
  test('WeakMap::clear', function(){
    var M, a, b;
    ok(isFunction(WeakMap.prototype.clear), 'Is function');
    M = new WeakMap().set(a = {}, 42).set(b = {}, 21);
    ok(M.has(a) && M.has(b), 'WeakMap has values before .delete()');
    M.clear();
    ok(!M.has(a) && !M.has(b), 'WeakMap has`nt values after .clear()');
  });
  test('WeakMap::delete', function(){
    var M, a, b;
    ok(isFunction(WeakMap.prototype['delete']), 'Is function');
    M = new WeakMap().set(a = {}, 42).set(b = {}, 21);
    ok(M.has(a) && M.has(b), 'WeakMap has values before .delete()');
    M['delete'](a);
    ok(!M.has(a) && M.has(b), 'WeakMap has`nt value after .delete()');
  });
  test('WeakMap::get', function(){
    var M, a;
    ok(isFunction(WeakMap.prototype.get), 'Is function');
    M = new WeakMap();
    ok(M.get({}) === void 8, 'WeakMap .get() before .set() return undefined');
    M.set(a = {}, 42);
    ok(M.get(a) === 42, 'WeakMap .get() return value');
    M['delete'](a);
    ok(M.get(a) === void 8, 'WeakMap .get() after .delete() return undefined');
  });
  test('WeakMap::has', function(){
    var M, a;
    ok(isFunction(WeakMap.prototype.has), 'Is function');
    M = new WeakMap();
    ok(M.has({}) === false, 'WeakMap .has() before .set() return false');
    M.set(a = {}, 42);
    ok(M.has(a), 'WeakMap .has() return true');
    M['delete'](a);
    ok(M.has(a) === false, 'WeakMap .has() after .delete() return false');
  });
  test('WeakMap::set', function(){
    var a, e;
    ok(isFunction(WeakMap.prototype.set), 'Is function');
    ok(new WeakMap().set(a = {}, 42), 'WeakMap.prototype.set works with object as keys');
    ok((function(){
      try {
        new WeakMap().set(42, 42);
        return false;
      } catch (e$) {
        e = e$;
        return true;
      }
    }()), 'WeakMap.prototype.set throw with primitive keys');
  });
  test('WeakMap::@@toStringTag', function(){
    ok(WeakMap.prototype[Symbol.toStringTag] === 'WeakMap', 'WeakMap::@@toStringTag is `WeakMap`');
  });
  test('WeakSet', function(){
    var a;
    ok(isFunction(that.WeakSet), 'Is function');
    ok('add' in WeakSet.prototype, 'add in WeakSet.prototype');
    ok('clear' in WeakSet.prototype, 'clear in WeakSet.prototype');
    ok('delete' in WeakSet.prototype, 'delete in WeakSet.prototype');
    ok('has' in WeakSet.prototype, 'has in WeakSet.prototype');
    ok(new WeakSet instanceof WeakSet, 'new WeakSet instanceof WeakSet');
    ok(new WeakSet([a = {}].values()).has(a), 'Init WeakSet from iterator #1');
    ok(new WeakSet([a = {}]).has(a), 'Init WeakSet from iterator #2');
  });
  test('WeakSet::add', function(){
    var a, e;
    ok(isFunction(WeakSet.prototype.add), 'Is function');
    ok(new WeakSet().add(a = {}), 'WeakSet.prototype.add works with object as keys');
    ok((function(){
      try {
        new WeakSet().add(42);
        return false;
      } catch (e$) {
        e = e$;
        return true;
      }
    }()), 'WeakSet.prototype.add throw with primitive keys');
  });
  test('WeakSet::clear', function(){
    var M, a, b;
    ok(isFunction(WeakSet.prototype.clear), 'Is function');
    M = new WeakSet().add(a = {}).add(b = {});
    ok(M.has(a) && M.has(b), 'WeakSet has values before .clear()');
    M.clear();
    ok(!M.has(a) && !M.has(b), 'WeakSet has`nt values after .clear()');
  });
  test('WeakSet::delete', function(){
    var M, a, b;
    ok(isFunction(WeakSet.prototype['delete']), 'Is function');
    M = new WeakSet().add(a = {}).add(b = {});
    ok(M.has(a) && M.has(b), 'WeakSet has values before .delete()');
    M['delete'](a);
    ok(!M.has(a) && M.has(b), 'WeakSet has`nt value after .delete()');
  });
  test('WeakSet::has', function(){
    var M, a;
    ok(isFunction(WeakSet.prototype.has), 'Is function');
    M = new WeakSet();
    ok(!M.has({}), 'WeakSet has`nt value');
    M.add(a = {});
    ok(M.has(a), 'WeakSet has value after .add()');
    M['delete'](a);
    ok(!M.has(a), 'WeakSet has`nt value after .delete()');
  });
  test('WeakSet::@@toStringTag', function(){
    ok(WeakSet.prototype[Symbol.toStringTag] === 'WeakSet', 'WeakSet::@@toStringTag is `WeakSet`');
  });
}).call(this);

(function(){
  var isIterator;
  QUnit.module('ES6 Iterators');
  isIterator = function(it){
    return typeof it === 'object' && typeof it.next === 'function';
  };
  test('String::@@iterator', function(){
    var iter;
    ok(typeof String.prototype[Symbol.iterator] === 'function', 'Is function');
    iter = 'qwe'[Symbol.iterator]();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Array::keys', function(){
    var iter;
    ok(typeof Array.prototype.keys === 'function', 'Is function');
    iter = ['q', 'w', 'e'].keys();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 0,
      done: false
    });
    deepEqual(iter.next(), {
      value: 1,
      done: false
    });
    deepEqual(iter.next(), {
      value: 2,
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Array::values', function(){
    var iter;
    ok(typeof Array.prototype.values === 'function', 'Is function');
    iter = ['q', 'w', 'e'].values();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Array::entries', function(){
    var iter;
    ok(typeof Array.prototype.entries === 'function', 'Is function');
    iter = ['q', 'w', 'e'].entries();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: [0, 'q'],
      done: false
    });
    deepEqual(iter.next(), {
      value: [1, 'w'],
      done: false
    });
    deepEqual(iter.next(), {
      value: [2, 'e'],
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Array::@@iterator', function(){
    var iter;
    ok(typeof Array.prototype[Symbol.iterator] === 'function', 'Is function');
    iter = ['q', 'w', 'e'][Symbol.iterator]();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Map::keys', function(){
    var iter;
    ok(typeof Map.prototype.keys === 'function', 'Is function');
    iter = new Map([['a', 'q'], ['s', 'w'], ['d', 'e']]).keys();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'a',
      done: false
    });
    deepEqual(iter.next(), {
      value: 's',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'd',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Map::values', function(){
    var iter;
    ok(typeof Map.prototype.values === 'function', 'Is function');
    iter = new Map([['a', 'q'], ['s', 'w'], ['d', 'e']]).values();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Map::entries', function(){
    var iter;
    ok(typeof Map.prototype.entries === 'function', 'Is function');
    iter = new Map([['a', 'q'], ['s', 'w'], ['d', 'e']]).entries();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: ['a', 'q'],
      done: false
    });
    deepEqual(iter.next(), {
      value: ['s', 'w'],
      done: false
    });
    deepEqual(iter.next(), {
      value: ['d', 'e'],
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Map::@@iterator', function(){
    var iter;
    ok(typeof Map.prototype[Symbol.iterator] === 'function', 'Is function');
    iter = new Map([['a', 'q'], ['s', 'w'], ['d', 'e']])[Symbol.iterator]();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: ['a', 'q'],
      done: false
    });
    deepEqual(iter.next(), {
      value: ['s', 'w'],
      done: false
    });
    deepEqual(iter.next(), {
      value: ['d', 'e'],
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Set::keys', function(){
    var iter;
    ok(typeof Set.prototype.keys === 'function', 'Is function');
    iter = new Set(['q', 'w', 'e']).keys();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Set::values', function(){
    var iter;
    ok(typeof Set.prototype.values === 'function', 'Is function');
    iter = new Set(['q', 'w', 'e']).values();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Set::entries', function(){
    var iter;
    ok(typeof Set.prototype.entries === 'function', 'Is function');
    iter = new Set(['q', 'w', 'e']).entries();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: ['q', 'q'],
      done: false
    });
    deepEqual(iter.next(), {
      value: ['w', 'w'],
      done: false
    });
    deepEqual(iter.next(), {
      value: ['e', 'e'],
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
  test('Set::@@iterator', function(){
    var iter;
    ok(typeof Set.prototype[Symbol.iterator] === 'function', 'Is function');
    iter = new Set(['q', 'w', 'e'])[Symbol.iterator]();
    ok(isIterator(iter), 'Return iterator');
    deepEqual(iter.next(), {
      value: 'q',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'w',
      done: false
    });
    deepEqual(iter.next(), {
      value: 'e',
      done: false
    });
    deepEqual(iter.next(), {
      value: void 8,
      done: true
    });
  });
}).call(this);

(function(){
  var isFunction, toString$ = {}.toString;
  QUnit.module('ES6 Promise');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  test('Promise', function(){
    ok(isFunction(((typeof global != 'undefined' && global !== null) && global || window).Promise), 'Is function');
  });
  test('::then', function(){
    ok(isFunction(Promise.prototype.then), 'Is function');
  });
  test('::catch', function(){
    ok(isFunction(Promise.prototype['catch']), 'Is function');
  });
  test('Promise', function(){
    ok(isFunction(((typeof global != 'undefined' && global !== null) && global || window).Promise), 'Is function');
  });
  test('::@@toStringTag', function(){
    ok(Promise.prototype[Symbol.toStringTag] === 'Promise', 'Promise::@@toStringTag is `Promise`');
  });
  test('.all', function(){
    ok(isFunction(Promise.all), 'Is function');
  });
  test('.race', function(){
    ok(isFunction(Promise.race), 'Is function');
  });
  test('.resolve', function(){
    ok(isFunction(Promise.resolve), 'Is function');
  });
  test('.reject', function(){
    ok(isFunction(Promise.reject), 'Is function');
  });
}).call(this);

(function(){
  var defineProperty, getOwnPropertyDescriptor, create, isFunction, isNative, that, toString$ = {}.toString;
  QUnit.module('ES6 Symbol');
  defineProperty = Object.defineProperty, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, create = Object.create;
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  isNative = function(it){
    return /\[native code\]\s*\}\s*$/.test(it);
  };
  that = (typeof global != 'undefined' && global !== null) && global || window;
  test('Symbol', function(){
    var s1, s2, O, count, i;
    ok(isFunction(that.Symbol), 'Is function');
    s1 = Symbol('foo');
    s2 = Symbol('foo');
    ok(s1 !== s2, 'Symbol("foo") !== Symbol("foo")');
    O = {};
    O[s1] = 42;
    ok(O[s1] === 42, 'Symbol() work as key');
    ok(O[s2] !== 42, 'Various symbols from one description are various keys');
    if (isNative(defineProperty)) {
      count = 0;
      for (i in O) {
        count++;
      }
      ok(count === 0, 'object[Symbol()] is not enumerable');
    }
  });
  test('.iterator', function(){
    ok('iterator' in Symbol, 'iterator in Symbol');
  });
  test('.toStringTag', function(){
    ok('toStringTag' in Symbol, 'toStringTag in Symbol');
  });
  test('::@@toStringTag', function(){
    ok(Symbol.prototype[Symbol.toStringTag] === 'Symbol', 'Symbol::@@toStringTag is `Symbol`');
  });
  test('.pure', function(){
    var pure;
    pure = Symbol.pure;
    ok(isFunction(pure), 'Is function');
    if (isNative(Symbol)) {
      ok(typeof pure() === 'symbol', 'Symbol.pure() return symbol');
    } else {
      ok(typeof pure() === 'string', 'Symbol.pure() return string');
    }
    ok(pure('S') !== pure('S'), 'Symbol.pure(key) != Symbol.pure(key)');
  });
  test('.set', function(){
    var set, O, sym;
    set = Symbol.set;
    ok(isFunction(set), 'Is function');
    O = {};
    sym = Symbol();
    ok(set(O, sym, 42) === O, 'Symbol.set return object');
    ok(O[sym] === 42, 'Symbol.set set value');
    if (!isNative(Symbol) && isNative(defineProperty)) {
      ok(getOwnPropertyDescriptor(O, sym).enumerable === false, 'Symbol.set set enumerable: false value');
    }
  });
  test('Reflect.ownKeys', function(){
    var O1, sym, keys, O2;
    ok(typeof Reflect != 'undefined' && Reflect !== null, 'Reflect is defined');
    ok(isFunction(Reflect.ownKeys), 'Reflect.ownKeys is function');
    O1 = {
      a: 1
    };
    defineProperty(O1, 'b', {
      value: 2
    });
    sym = Symbol('c');
    O1[sym] = 3;
    keys = Reflect.ownKeys(O1);
    ok(keys.length === 3, 'ownKeys return all own keys');
    ok(O1[keys[0]] === 1, 'ownKeys return all own keys: simple');
    ok(O1[keys[1]] === 2, 'ownKeys return all own keys: hidden');
    ok(O1[keys[2]] === 3, 'ownKeys return all own keys: symbol');
    O2 = clone$(O1);
    keys = Reflect.ownKeys(O2);
    ok(keys.length === 0, 'ownKeys return only own keys');
  });
  function clone$(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);

(function(){
  QUnit.module('Global');
  test('global', function(){
    ok(typeof global != 'undefined' && global !== null, 'global is define');
    ok(global.global === global, 'global.global is global');
    global.__tmp__ = {};
    ok(__tmp__ === global.__tmp__, 'global object properties are global variables');
  });
}).call(this);

(function(){
  var isFunction, that, req, toString$ = {}.toString;
  QUnit.module('Immediate');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  that = (typeof global != 'undefined' && global !== null) && global || window;
  asyncTest('setImmediate / clearImmediate', 6, function(){
    var tmp1, id, tmp2, tmp3, tmp4;
    ok(isFunction(that.setImmediate), 'setImmediate is function');
    ok(isFunction(that.clearImmediate), 'clearImmediate is function');
    id = setImmediate(function(){
      tmp1 = 42;
    });
    ok(tmp1 === void 8, 'setImmediate is async');
    setImmediate(function(){
      tmp2 = true;
    });
    setImmediate(function(b, c){
      tmp3 = b + c;
    }, 'b', 'c');
    clearImmediate(setImmediate(function(){
      tmp4 = 42;
    }));
    setTimeout(function(){
      ok(tmp2, 'setImmediate works');
    }, 70);
    setTimeout(function(){
      ok(tmp3 === 'bc', 'setImmediate works with additional params');
    }, 80);
    setTimeout(function(){
      ok(tmp4 === void 8, 'clearImmediate works');
    }, 90);
    setTimeout(start, 100);
  });
  req = function(){
    return setTimeout(function(){
      var x, now, inc;
      x = 0;
      now = Date.now();
      return (inc = function(){
        return setImmediate(function(){
          x = x + 1;
          if (Date.now() - now < 1000) {
            return inc();
          } else {
            return console("setImmediate: " + x + " per second");
          }
        });
      })();
    }, 5e3);
  };
  if (typeof window != 'undefined' && window !== null) {
    window.onload = req;
  } else {
    req();
  }
}).call(this);

(function(){
  var isFunction, toString$ = {}.toString;
  QUnit.module('Number');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  test('::@@iterator', function(){
    var iterator, toStringTag, iter1, iter2, iter3;
    iterator = Symbol.iterator, toStringTag = Symbol.toStringTag;
    ok(isFunction(Number.prototype[iterator]), 'Is function');
    iter1 = 2[iterator]();
    ok(iter1[toStringTag] === 'Number Iterator');
    deepEqual(iter1.next(), {
      done: false,
      value: 0
    });
    deepEqual(iter1.next(), {
      done: false,
      value: 1
    });
    deepEqual(iter1.next(), {
      done: true,
      value: void 8
    });
    iter2 = 1.5[iterator]();
    deepEqual(iter2.next(), {
      done: false,
      value: 0
    });
    deepEqual(iter2.next(), {
      done: true,
      value: void 8
    });
    iter3 = (-1)[iterator]();
    deepEqual(iter3.next(), {
      done: true,
      value: void 8
    });
  });
  test('::random', function(){
    ok(isFunction(Number.prototype.random), 'Is function');
    ok((function(){
      var i$, results$ = [];
      for (i$ = 0; i$ < 100; ++i$) {
        results$.push(10 .random());
      }
      return results$;
    }()).every(function(it){
      return 0 <= it && it <= 10;
    }));
    ok((function(){
      var i$, results$ = [];
      for (i$ = 0; i$ < 100; ++i$) {
        results$.push(10 .random(7));
      }
      return results$;
    }()).every(function(it){
      return 7 <= it && it <= 10;
    }));
    ok((function(){
      var i$, results$ = [];
      for (i$ = 0; i$ < 100; ++i$) {
        results$.push(7 .random(10));
      }
      return results$;
    }()).every(function(it){
      return 7 <= it && it <= 10;
    }));
  });
  test('::#{...Math}', function(){
    var i$, x$, ref$, len$;
    for (i$ = 0, len$ = (ref$ = ['round', 'floor', 'ceil', 'abs', 'sin', 'asin', 'cos', 'acos', 'tan', 'atan', 'exp', 'sqrt', 'max', 'min', 'pow', 'atan2', 'acosh', 'asinh', 'atanh', 'cbrt', 'clz32', 'cosh', 'expm1', 'hypot', 'imul', 'log1p', 'log10', 'log2', 'sign', 'sinh', 'tanh', 'trunc']).length; i$ < len$; ++i$) {
      x$ = ref$[i$];
      ok(isFunction(Number.prototype[x$]), "Number::" + x$ + " is function");
    }
    ok(1 .min() === 1, 'context is argument of Number::{Math}');
    ok(3 .max(2) === 3, 'context is argument of Number::{Math}');
    ok(3 .min(2) === 2, 'Number::{Math} works with first argument');
    ok(1 .max(2, 3, 4, 5, 6, 7) === 7, 'Number::{Math} works with various arguments length');
  });
}).call(this);

(function(){
  var isFunction, isNative, getPrototypeOf, defineProperty, getOwnPropertyDescriptor, toString$ = {}.toString;
  QUnit.module('Object');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  isNative = function(it){
    return /\[native code\]\s*\}\s*$/.test(it);
  };
  getPrototypeOf = Object.getPrototypeOf, defineProperty = Object.defineProperty, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  test('.isObject', function(){
    var isObject;
    isObject = Object.isObject;
    ok(isFunction(isObject), 'Is function');
    ok(!isObject(void 8), 'isObject undefined return false');
    ok(!isObject(null), 'isObject null return false');
    ok(!isObject(1), 'isObject number return false');
    ok(!isObject(true), 'isObject bool return false');
    ok(!isObject('string'), 'isObject string return false');
    ok(isObject(new Number(1)), 'isObject new Number return true');
    ok(isObject(new Boolean(false)), 'isObject new Boolean return true');
    ok(isObject(new String(1)), 'isObject new String return true');
    ok(isObject({}), 'isObject object return true');
    ok(isObject([]), 'isObject array return true');
    ok(isObject(/./), 'isObject regexp return true');
    ok(isObject(function(){}), 'isObject function return true');
    ok(isObject(new function(){}), 'isObject constructor instance return true');
  });
  test('.classof', function(){
    var classof, Class, BadClass;
    classof = Object.classof;
    ok(isFunction(classof), 'Is function');
    ok(classof(void 8) === 'Undefined', 'classof undefined is `Undefined`');
    ok(classof(null) === 'Null', 'classof null is `Null`');
    ok(classof(true) === 'Boolean', 'classof bool is `Boolean`');
    ok(classof('string') === 'String', 'classof string is `String`');
    ok(classof(7) === 'Number', 'classof number is `Number`');
    ok(classof(Symbol()) === 'Symbol', 'classof symbol is `Symbol`');
    ok(classof(new Boolean(false)) === 'Boolean', 'classof new Boolean is `Boolean`');
    ok(classof(new String('')) === 'String', 'classof new String is `String`');
    ok(classof(new Number(7)) === 'Number', 'classof new Number is `Number`');
    ok(classof({}) === 'Object', 'classof {} is `Object`');
    ok(classof([]) === 'Array', 'classof array is `Array`');
    ok(classof(function(){}) === 'Function', 'classof function is `Function`');
    ok(classof(/./) === 'RegExp', 'classof regexp is `Undefined`');
    ok(classof(TypeError()) === 'Error', 'classof new TypeError is `RegExp`');
    ok(classof(function(){
      return arguments;
    }()) === 'Arguments', 'classof arguments list is `Arguments`');
    ok(classof(new Set) === 'Set', 'classof undefined is `Map`');
    ok(classof(new Map) === 'Map', 'classof map is `Undefined`');
    ok(classof(new WeakSet) === 'WeakSet', 'classof weakset is `WeakSet`');
    ok(classof(new WeakMap) === 'WeakMap', 'classof weakmap is `WeakMap`');
    ok(classof(new Promise(function(){})) === 'Promise', 'classof promise is `Promise`');
    ok(classof([].entries()) === 'Array Iterator', 'classof Array Iterator is `Array Iterator`');
    ok(classof(new Set().entries()) === 'Set Iterator', 'classof Set Iterator is `Set Iterator`');
    ok(classof(new Map().entries()) === 'Map Iterator', 'classof Map Iterator is `Map Iterator`');
    ok(classof(Math) === 'Math', 'classof Math is `Math`');
    if (typeof JSON != 'undefined' && JSON !== null) {
      ok(classof(JSON) === 'JSON', 'classof JSON is `JSON`');
    }
    Class = (function(){
      Class.displayName = 'Class';
      var prototype = Class.prototype, constructor = Class;
      Class.prototype[Symbol.toStringTag] = 'Class';
      function Class(){}
      return Class;
    }());
    ok(classof(new Class) === 'Class', 'classof user class is [Symbol.toStringTag]');
    BadClass = (function(){
      BadClass.displayName = 'BadClass';
      var prototype = BadClass.prototype, constructor = BadClass;
      BadClass.prototype[Symbol.toStringTag] = 'Array';
      function BadClass(){}
      return BadClass;
    }());
    ok(classof(new BadClass) === '~Array', 'safe [[Class]]');
  });
  test('.make', function(){
    var make, object, foo;
    make = Object.make;
    ok(isFunction(make), 'Is function');
    object = make(foo = {
      q: 1
    }, {
      w: 2
    });
    ok(getPrototypeOf(object) === foo);
    ok(object.w === 2);
  });
  test('.define', function(){
    var define, foo, foo2;
    define = Object.define;
    ok(isFunction(define), 'Is function');
    foo = {
      q: 1
    };
    ok(foo === define(foo, {
      w: 2
    }));
    ok(foo.w === 2);
    if (isNative(getOwnPropertyDescriptor)) {
      foo = {
        q: 1
      };
      foo2 = defineProperty({}, 'w', {
        get: function(){
          return this.q + 1;
        }
      });
      define(foo, foo2);
      ok(foo.w === 2);
    }
  });
}).call(this);

(function(){
  var isFunction, toString$ = {}.toString;
  QUnit.module('RegExp');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  test('.escape', function(){
    var escape;
    escape = RegExp.escape;
    ok(isFunction(escape), 'Is function');
    ok(escape('qwe asd') === 'qwe asd', "Don't change simple string");
    ok(escape('\\-[]{}()*+?.,^$|') === "\\\\\\-\\[\\]\\{\\}\\(\\)\\*\\+\\?\\.\\,\\^\\$\\|", 'Escape all RegExp special chars');
  });
}).call(this);

(function(){
  var isFunction, toString$ = {}.toString;
  QUnit.module('String');
  isFunction = function(it){
    return toString$.call(it).slice(8, -1) === 'Function';
  };
  test('::escapeHTML', function(){
    ok(isFunction(String.prototype.escapeHTML), 'Is function');
    ok('qwe, asd'.escapeHTML() === 'qwe, asd');
    ok('<div>qwe</div>'.escapeHTML() === '&lt;div&gt;qwe&lt;/div&gt;');
    ok("&<>\"'".escapeHTML() === '&amp;&lt;&gt;&quot;&apos;');
  });
  test('::unescapeHTML', function(){
    ok(isFunction(String.prototype.unescapeHTML), 'Is function');
    ok('qwe, asd'.unescapeHTML() === 'qwe, asd');
    ok('&lt;div&gt;qwe&lt;/div&gt;'.unescapeHTML() === '<div>qwe</div>');
    ok('&amp;&lt;&gt;&quot;&apos;'.unescapeHTML() === "&<>\"'");
  });
}).call(this);

(function(){
  var that, slice$ = [].slice;
  QUnit.module('Timers');
  that = (typeof global != 'undefined' && global !== null) && global || window;
  asyncTest('setTimeout / clearTimeout', 2, function(){
    that.setTimeout(function(b, c){
      ok(b + c === 'bc');
    }, 1, 'b', 'c');
    clearTimeout(partialize$.apply(that, [
      that.setTimeout, [
        void 8, 1, function(){
          ok(false);
        }
      ], [0]
    ]));
    that.setTimeout(function(){
      ok(true);
      start();
    }, 20);
  });
  asyncTest('setInterval / clearInterval', 6, function(){
    var i, interval;
    i = 1;
    interval = that.setInterval(function(it){
      ok(i < 4);
      ok(it === 42);
      if (i === 3) {
        clearInterval(interval);
        start();
      }
      i = i + 1;
    }, 1, 42);
  });
  function partialize$(f, args, where){
    var context = this;
    return function(){
      var params = slice$.call(arguments), i,
          len = params.length, wlen = where.length,
          ta = args ? args.concat() : [], tw = where ? where.concat() : [];
      for(i = 0; i < len; ++i) { ta[tw[0]] = params[i]; tw.shift(); }
      return len < wlen && len ?
        partialize$.apply(context, [f, ta, tw]) : f.apply(context, ta);
    };
  }
}).call(this);
