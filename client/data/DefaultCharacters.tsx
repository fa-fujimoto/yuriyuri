import { IDefaultCharacter } from "client/types/type"

const DefaultCharacters: IDefaultCharacter[] = [
  {
    id: 'red',
    lastName: '赤根',
    firstName: '鞠花',
    birthday: new Date(2179, 6, 22),
    birthplace: '東の方',
    words: [
      'えへへ…告白されちゃった',
      'その、じっと見られると…照れちゃいます',
    ],
    skills: [
      'aggressive',
      'attracting',
    ],
    iconType: 3,
  },
  {
    id: 'black',
    lastName: '黒木',
    firstName: '蘭',
    birthday: new Date(2179, 10, 6),
    birthplace: '西の島',
    words: [
      'あーっあーっあーっ　なんで私のポエム帳あーっ！',
      'なによ、そんなに意外なの？',
    ],
    skills: [
      'attracting',
      'cute',
    ],
    iconType: 3,
  },
  {
    id: 'purple',
    lastName: '紫藤',
    firstName: '薫',
    birthday: new Date(2180, 3, 15),
    birthplace: '旧都',
    words: [
      'うんうん、それもまた青春やね',
      'もじもじ…って口に出したら、おかしいね',
    ],
    skills: [
      'passive',
      'friendly',
    ],
    iconType: 3,
  },
  {
    id: 'green',
    lastName: '綠野',
    firstName: '文子',
    birthday: new Date(2180, 1, 12),
    birthplace: '地元っ子',
    words: [
      'あまり頭はよくなくて…ごめんなさい',
      '私みたいな、取り柄のない子でも…いいですか？',
    ],
    skills: [
      'passive',
      'shy',
    ],
    iconType: 3,
  },
  {
    id: 'sky',
    lastName: '空井',
    firstName: '美菜',
    birthday: new Date(2179, 4, 5),
    birthplace: '隣町',
    words: [
      'この後ちょっと役員室来てくれない？　いやーなんでもないんだけどさ、ほら',
      'そういうことする人は、嫌いだな',
    ],
    skills: [
      'aggressive',
      'cool',
    ],
    iconType: 3,
  },
  {
    id: 'white',
    lastName: '白樺',
    firstName: 'アレクサンドラ',
    birthday: new Date(2179, 6, 22),
    birthplace: '北の国',
    words: [
      'ロシア語は、ちょっとだけ',
      'ジロジロ見ないでくださいっ',
    ],
    skills: [
      'shy',
      'attracting',
    ],
    iconType: 3,
  },
  {
    id: 'yellow',
    lastName: '黄楊',
    firstName: '久',
    birthday: new Date(2179, 8, 28),
    birthplace: '地元っ子',
    words: [
      'はろはろー、今日も2人はおアツいねっ',
      'んーなんていうか、私はそういうのガラじゃないってゆーか',
    ],
    skills: [
      'attracted',
      'friendly',
    ],
    iconType: 3,
  },
  {
    id: 'gray',
    lastName: '灰羅',
    firstName: 'イルミ',
    birthday: new Date(2179),
    birthplace: '',
    words: [
    ],
    skills: [
      'cool',
      'friendly',
    ],
    iconType: 3,
  },
  {
    id: 'pink',
    lastName: '桃園',
    firstName: '蓮華',
    birthday: new Date(2179),
    birthplace: '',
    words: [
    ],
    skills: [
      'cute',
      'shy',
    ],
    iconType: 3,
  },
]

export default DefaultCharacters