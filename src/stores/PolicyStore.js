"use strict";
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var {EventEmitter} = require('events');
var assign = require('object-assign');

var {ActionTypes} = AppConstants;
var CHANGE_EVENT = 'change';
var _policies = {
  "1": {"1":{"id":1,"title":"城市發展","content":"<p>城市，是我們共同生活的地方。我們在城市裡居住、學習、工作、成長，整個城市不是各種建築、馬路、工程等種種無機物的組成，而是一個由各種年齡、性別、背景、信仰的人們共同結合的大型有機體。一座城市的「發展」該如何定義？我們未來的城市想像應該是什麼樣子？讓我們一起提出問題，也一起尋找解答。</p>"},"2":{"id":2,"title":"市政經營","content":"<p>百年的台北城發展至今，經歷過清朝、日本、民國的治理。在每個政府，每個不同時期，因為執政者的思維以及目的，台北城的發展也因此不同的特色。當年李登輝先生擔任三年多的台北市長，是用什麼樣的想法與原則在經營市政呢？2014年的今天，我們又應該用什麼樣的角度去看待市政經營呢？</p>"},"3":{"id":3,"title":"國家前途思維","content":"<p>台灣的國家定位一直不明，「中華民國已經是主權獨立的國家？」、「中華民國是流亡政府？」、我們該走向統一？獨立？還是維持現狀？這些都是台灣長年無解的問題。作為一個台灣人，我們到底該怎麼樣認同我們的國家？又或者，從更大的格局去看，我們要如何強大我們的國家，該如何決定台灣的前途？</p>"},"4":{"id":4,"title":"領導能力","content":"<p>領導的風格、方式有千百種，至於哪一種方式好則末衷一是。市長當然無疑是一位領導者，那麼作為一個城市的領導人，他/她應該具備有哪些能力呢？李登輝先生擔任過台北市長、台灣省主席以及總統，在卸任十多年後回頭再看，會認為一個領導人應該具備怎麼樣的能力呢？</p>"},"5":{"id":5,"title":"世代正義","content":"<p>世代正義是近年來最夯的話題。房價、物價高漲、但是年輕人的薪水卻不漲。年輕人超時工作，領的薪水卻比已經退休的軍公教人員的退休俸還少。不管是哪個世代，都不得不承認，現在的年輕人即使跟當年的長輩一樣努力，也不敢盼望在長輩現在的年紀能夠過著和他們一樣水準的生活。和年輕人隔了兩、三個世代，高齡九十一歲的李登輝先生，是如何看待世代正義的問題？對於世代正義的解決又有什麼樣的想像？</p>"}}
};

var PolicyStore = assign({}, EventEmitter.prototype, {

  emitChange () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get (query) {
    var {cid, index} = query;
    return {
      policy: _policies[cid][index],
      next: ~~index + 1,
      prev: ~~index - 1,
      limit: Object.keys(_policies[cid]).length
    };
  },

  getAllFrom (cid) {
    if(!cid) {
      return [];
    }

    return Object.keys(_policies[cid]).map((p) => {
      return _policies[cid][p];
    });
  }
});

PolicyStore.dispatchToken = AppDispatcher.register((payload) => {
  var {action} = payload;
  switch(action.type) {
    default:
  }

});

module.exports = PolicyStore;