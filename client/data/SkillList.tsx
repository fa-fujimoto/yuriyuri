import {ISkill} from '../types/type'

const SkillList: ISkill[] = [
  {
    id: 'aggressive',
    name: 'Aggressive',
    japanese: '大胆な告白',
    overview: '告白時カップル成立判定の達成値+2',
    description: 'この性向を持つ女の子が告白をして断られた時のカップル成立のダイス判定時に、好感度が + 2されているとみなして判定をする',
    iconName: 'fire',
  },
  {
    id: 'attracting',
    name: 'Attracting',
    japanese: '惑わす魅力',
    overview: '好感度5でカップル自然成立',
    description: 'カップルのフェーズで、この性向を持つ女の子を含む女の子組は好感度5でカップルになる（好感度上限は6のまま / Attractingの重複なし）',
    iconName: 'magnet',
  },
  {
    id: 'cool',
    name: 'Cool',
    japanese: '怜悧な美人',
    overview: 'ゲーム開始フェーズで好感度+3',
    description: 'ゲーム開始フェーズにこの性向を持つ女の子のコントロールを得たプレイヤーは、その女の子と他の女の子1人との好感度を + 3する。',
    iconName: 'star-of-david',
  },
  {
    id: 'passive',
    name: 'Passive',
    japanese: '告白待ち',
    overview: '告白された時に好感度+1',
    description: 'この性向を持つ女の子が告白された時、告白をした女の子との間の好感度をその時点 + 1する。その後、通常の告白を受けた場合の処理の移る。(告白をされた場合、断っても断らなくても好感度 + 1。断った上でカップル非成立の場合、さらに好感度 + 1)',
    iconName: 'star-and-crescent',
  },
  {
    id: 'shy',
    name: 'Shy',
    japanese: '人見知り',
    overview: '好感度0でアプローチされた時、好感度+3',
    description: 'この性向を持つ女の子が好感度0の女の子からアプローチされた時、好感度は + 1のかわりに + 3される',
    iconName: 'lock',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    japanese: 'みんななかよし？',
    overview: '「駆け引き」時に3票分',
    description: 'この性向を持つ女の子は、「駆け引き」で投票する時に3票分を持つ(投票先は1つで、票の分割はできない)',
    iconName: 'address-card',
  },
  {
    id: 'cute',
    name: 'Cute',
    japanese: 'あふれる可愛げ',
    overview: '誓いのキス判定の達成値+1',
    description: 'この性向を持つ女の子を含むカップルは、誓いのキス判定の達成値に + 1をする',
    iconName: 'leaf',
  },
  {
    id: 'attracted',
    name: 'Attracted',
    japanese: '人を見つめる',
    overview: 'カップル維持の判定時、達成値+1',
    description: 'この性向を持つ女の子を含むカップルは、カップルのフェーズで別れる判定のダイスをする時に、不満度が - 1されているとみなして判定をする。（不満度6で別れる処理には影響しない）',
    iconName: 'low-vision',
  },
]

export default SkillList
