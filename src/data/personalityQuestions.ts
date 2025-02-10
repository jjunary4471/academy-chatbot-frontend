export interface Question {
    id: number;
    text: string;
    section: string;
    factor: 'A' | 'B' | 'C' | 'D' | 'E' | 'S';
  }
  
  export const questions: Question[] = [
    // A因子
    { id: 1, text: "他人の言葉をさえぎって、自分の考えを述べることがある", section: "A", factor: "A" },
    { id: 2, text: "他人のミスをきびしく批判する事が多い", section: "A", factor: "A" },
    { id: 3, text: "待ち合わせ時間は厳守する", section: "A", factor: "A" },
    { id: 4, text: "理想の実現ために努力する", section: "A", factor: "A" },
    { id: 5, text: "規則、倫理、道徳などを重視する", section: "A", factor: "A" },
    { id: 6, text: "他人に責任感を強く要求する", section: "A", factor: "A" },
    { id: 7, text: "小さな不正でも、うやむやにしない", section: "A", factor: "A" },
    { id: 8, text: "子供や部下を厳しく教育する", section: "A", factor: "A" },
    { id: 9, text: "権利を主張する前に義務を果たすべきと思う", section: "A", factor: "A" },
    { id: 10, text: "「・・すべきである」「・・ねばならない」という表現をよくする", section: "A", factor: "A" },
    
    // B因子
    { id: 11, text: "他人に対する思いやりの気持ちが強い", section: "B", factor: "B" },
    { id: 12, text: "義理や人情を重視する", section: "B", factor: "B" },
    { id: 13, text: "相手の長所に良く気がつく", section: "B", factor: "B" },
    { id: 14, text: "他人から頼まれたらなかなかイヤとは言えない", section: "B", factor: "B" },
    { id: 15, text: "子供や他人の世話をするのが好き", section: "B", factor: "B" },
    { id: 16, text: "何事も臨機応変に対応できる", section: "B", factor: "B" },
    { id: 17, text: "子供や部下の失敗に寛大である", section: "B", factor: "B" },
    { id: 18, text: "相手の話をよく聞き、共感し易い", section: "B", factor: "B" },
    { id: 19, text: "洗濯、料理、掃除などは好きな方だ", section: "B", factor: "B" },
    { id: 20, text: "ボランティアに参加する事が好き", section: "B", factor: "B" },
    
    // C因子
    { id: 21, text: "自分の損得を優先して行動する", section: "C", factor: "C" },
    { id: 22, text: "会話で感情的になることは少ない", section: "C", factor: "C" },
    { id: 23, text: "物事は分析的に良く考えてから決める", section: "C", factor: "C" },
    { id: 24, text: "他人の意見は、賛否両論を聞き、自分の意見の参考にする", section: "C", factor: "C" },
    { id: 25, text: "何事も事実や数字に基づいて判断する", section: "C", factor: "C" },
    { id: 26, text: "情緒的というより、論理的である", section: "C", factor: "C" },
    { id: 27, text: "物事の決断はすばやくできる", section: "C", factor: "C" },
    { id: 28, text: "仕事は能率的にテキパキ片付けていく", section: "C", factor: "C" },
    { id: 29, text: "将来のことを冷静に予測して計画的に行動する", section: "C", factor: "C" },
    { id: 30, text: "身体の調子の悪いときは、大事をとって無理をしない", section: "C", factor: "C" },
    
    // D因子
    { id: 31, text: "自分をわがままだと思う", section: "D", factor: "D" },
    { id: 32, text: "自分は好奇心旺盛だと思う", section: "D", factor: "D" },
    { id: 33, text: "娯楽、飲食などは満足するまで求める", section: "D", factor: "D" },
    { id: 34, text: "思ったことを遠慮なく言ってしまう", section: "D", factor: "D" },
    { id: 35, text: "欲しいものは、すぐ手に入れないと気が済まない", section: "D", factor: "D" },
    { id: 36, text: "「わぁ」「すごい」「へぇ」などオーバーな表現を良く使う", section: "D", factor: "D" },
    { id: 37, text: "物事を直感で判断する事が多い", section: "D", factor: "D" },
    { id: 38, text: "図に乗ると度をこし、はめをはずしてしまう", section: "D", factor: "D" },
    { id: 39, text: "物事は明るく前向きに考える", section: "D", factor: "D" },
    { id: 40, text: "感動し易く、涙もろい", section: "D", factor: "D" },
    
    // E因子
    { id: 41, text: "思っていることを口に出せない事が多い", section: "E", factor: "E" },
    { id: 42, text: "他人から気に入られたいと思う", section: "E", factor: "E" },
    { id: 43, text: "遠慮がちで消極的な方である", section: "E", factor: "E" },
    { id: 44, text: "自分の考えをとおすより、妥協することが多い", section: "E", factor: "E" },
    { id: 45, text: "他人の顔色や、言うことが気になる", section: "E", factor: "E" },
    { id: 46, text: "つらい時には、じっと我慢してしまう", section: "E", factor: "E" },
    { id: 47, text: "他人の期待に応えようと、過剰な努力をすることがある", section: "E", factor: "E" },
    { id: 48, text: "人前では自分の感情を抑えてしまう", section: "E", factor: "E" },
    { id: 49, text: "劣等感を強く感じる事がある", section: "E", factor: "E" },
    { id: 50, text: "少数派に成るより、多数派でいる方が安心する", section: "E", factor: "E" },
    
    // ストレス因子
    { id: 51, text: "便秘や下痢をするが時々ある", section: "S", factor: "S" },
    { id: 52, text: "眼が疲れやすい", section: "S", factor: "S" },
    { id: 53, text: "食欲がない事が時々ある", section: "S", factor: "S" },
    { id: 54, text: "首筋や肩がこることがよくある", section: "S", factor: "S" },
    { id: 55, text: "胃や腸の具合はあまり良くない", section: "S", factor: "S" },
    { id: 56, text: "頭が重いとか、頭痛がする", section: "S", factor: "S" },
    { id: 57, text: "よく眠れないことがある", section: "S", factor: "S" },
    { id: 58, text: "「かぜ」をひきやすい", section: "S", factor: "S" },
    { id: 59, text: "イライラして、落ち着かない", section: "S", factor: "S" },
    { id: 60, text: "「だるい」と感じることがよくある", section: "S", factor: "S" }
  ];