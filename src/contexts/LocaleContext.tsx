import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'ko' | 'ja';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations = {
  ko: {
    // Common
    'common.resolved': '해결완료',
    'common.unresolved': '미해결',
    'common.total': '총',
    'common.cases': '건',
    'common.cancel': '취소',
    'common.save': '저장',
    'common.processing': '처리중...',
    'common.noData': '데이터가 없습니다',
    'common.name': '이름',
    'common.date': '날짜',
    'common.type': '유형',
    'common.status': '상태',
    'common.action': '작업',
    'common.back': '뒤로',
    'common.next': '다음',
    'common.complete': '완료',
    'common.search': '검색',
    'common.id': '아이디',
    'common.email': '이메일',
    'common.password': '비밀번호',
    'common.role': '역할',
    'common.login': '로그인',
    'common.signup': '회원가입',
    'common.logout': '로그아웃',
    'common.home': '홈',
    'common.menu': '메뉴',
    'common.close': '닫기',

    // Auth
    'auth.login.title': '교육 관리 시스템',
    'auth.login.enterUserId': '아이디를 입력하세요',
    'auth.login.processing': '로그인 중...',
    'auth.login.failed': '로그인에 실패했습니다',
    'auth.login.userNotFound': '사용자를 찾을 수 없습니다',
    'auth.login.networkError': '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
    'auth.signup.title': '회원가입',
    'auth.signup.academyId': '아카데미 ID',
    'auth.signup.userId': '사용자 ID',
    'auth.signup.name': '이름',
    'auth.signup.role.teacher': '교사 (TEACHER)',
    'auth.signup.role.student': '학생 (STUDENT)',
    'auth.signup.role.parent': '학부모 (PARENT)',
    'auth.signup.admissionDate': '입학일',
    'auth.signup.childId': '자녀 ID',
    'auth.signup.processing': '처리중...',
    'auth.signup.backToLogin': '로그인으로 돌아가기',
    'auth.signup.success': '회원가입이 완료되었습니다. 로그인해주세요.',

    // Dashboard
    'dashboard.admin.title': '학생 관리',
    'dashboard.student.title': '학생 대시보드',
    'dashboard.parent.title': '학부모 대시보드',
    'dashboard.welcome': '안녕하세요, {name}님!',
    'dashboard.welcome.message': '안녕하세요, 오늘도 함께 이야기해보아요.',
    'dashboard.search.placeholder': '학생 이름 또는 아이디로 검색...',
    'dashboard.filter.unresolvedOnly': '미해결 위험요소만 보기',
    'dashboard.recentActivity': '최근 활동',

    // Student Menu
    'student.menu.typeCheck': '성격 진단 테스트',
    'student.menu.typeCheck.desc': '나의 성향과 학습 스타일을 알아보세요',
    'student.menu.chatbot': '챗봇상담',
    'student.menu.chatbot.desc': '궁금한 점을 자유롭게 물어보세요',
    'student.menu.matchingQa': '맞춤질문답변',
    'student.menu.matchingQa.desc': '학부모님의 질문에 답변해주세요',
    'student.activity.typeCheck': '성격 진단 완료',
    'student.activity.chatbot': '챗봇 상담',
    'student.menu.report.desc': '나의 성격 진단 결과를 확인해보세요',
    'student.menu.community':'챗봇 친구',
    'student.menu.community.desc':'챗봇에서의 질문에 답변해주세요',


    // Parent Menu
    'parent.menu.report.desc': '자녀의 성격 진단 결과를 확인해보세요',
    'parent.menu.chatbot.desc': '자녀의 학습과 관련된 상담을 해보세요',
    'parent.childInfo': '자녀 정보',
    'parent.childName': '자녀 이름',
    'parent.noChildInfo': '등록된 자녀 정보가 없습니다',
    'parent.chatbot.placeholder': '자녀의 학습에 대해 궁금한 점을 물어보세요...',
    'parent.chatbot.error': '메시지 전송에 실패했습니다. 다시 시도해주세요.',

    // Student Chat
    'student.chatbot.placeholder': '메시지를 입력하세요...',
    'student.chatbot.send': '메시지 보내기',
    'student.chatbot.error': '메시지 전송에 실패했습니다. 다시 시도해주세요.',
    'student.chatbot.response1': "네, 말씀해 주세요. 제가 도와드리겠습니다.",
    'student.chatbot.response2': "흥미로운 이야기네요. 더 자세히 들려주시겠어요?",
    'student.chatbot.response3': "그렇군요. 제가 도움이 될 만한 제안을 해드릴게요.",
    'student.chatbot.response4': "좋은 질문이에요. 함께 고민해보도록 할까요?",

    // Personality Test
    'personality.test.title': '성격 진단 테스트',
    'personality.test.section.title': '섹션 {section}',
    'personality.test.progress': '{current}/{total} 답변 완료',
    'personality.test.answer.yes': '예',
    'personality.test.answer.no': '아니오',
    'personality.test.submit': '제출',
    'personality.test.processing': '결과 분석 중...',
    'personality.test.error': '테스트 제출 중 오류가 발생했습니다',
    'personality.test.section.A': '규범성',
    'personality.test.section.B': '협조성',
    'personality.test.section.C': '논리성',
    'personality.test.section.D': '활동성',
    'personality.test.section.E': '안정성',
    'personality.test.section.S': '스트레스',

    // Report
    'report.title': '성격 진단 레포트',
    'report.studentInfo': '학생 정보',
    'report.parentInfo': '학부모 정보',
    'report.noParentInfo': '등록된 학부모 정보가 없습니다',
    'report.list': '레포트 일람',
    'report.date': '진단일',
    'report.result': '진단 결과',
    'report.detail.title': '성격 진단 상세 보고서',
    'report.detail.analysis': '성격 유형 분석',
    'report.detail.primaryType': '주요 성향',
    'report.detail.secondaryType': '보조 성향',
    'report.detail.recommendations': '맞춤형 학습 추천',
    'report.detail.studentInfo': '학생 정보',
    'report.detail.testDate': '진단일',
    'report.detail.learningStyle': '학습 스타일',

    // Risk
    'risk.management': '위험요소 관리',
    'risk.studentInfo': '학생 정보',
    'risk.parentInfo': '학부모 정보',
    'risk.status': '위험요소 현황',
    'risk.totalRisks': '총 위험요소',
    'risk.unresolvedRisks': '미해결',
    'risk.resolvedRisks': '해결완료',
    'risk.resolutionRate': '해결률',
    'risk.list': '위험요소 목록',
    'risk.enterResolution': '해결 내용 입력',
    'risk.resolutionContent': '해결 내용',
    'risk.resolutionPlaceholder': '해결 방안이나 조치 내용을 입력해 주세요',
    'risk.markAsResolved': '해결 처리',
    'risk.admissionDate': '최근의 위험요소 감지',

    // personality type
    'personality.type.sumomo.desc': '활발하고 적극적이며, 다른 사람들과 어울리기를 좋아합니다.',
    'personality.type.digital.desc': '논리적이고 체계적인 접근을 선호하며, 효율성을 중시합니다.',
    'personality.type.sumomo.rec1': '그룹 활동 중심 학습',
    'personality.type.sumomo.rec2': '발표와 토론 기회 제공',
    'personality.type.sumomo.rec3': '실전 문제 해결 활동',
    'personality.type.digital.rec1': '온라인 학습 도구 활용',
    'personality.type.digital.rec2': '데이터 기반 학습 방법',
    'personality.type.digital.rec3': '체계적인 문제 해결 접근',
  },
  ja: {
    // Common
    'common.resolved': '解決済み',
    'common.unresolved': '未解決',
    'common.total': '合計',
    'common.cases': '件',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.processing': '処理中...',
    'common.noData': 'データがありません',
    'common.name': '名前',
    'common.date': '日付',
    'common.type': '種類',
    'common.status': '状態',
    'common.action': '操作',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.complete': '完了',
    'common.search': '検索',
    'common.id': 'ID',
    'common.email': 'メール',
    'common.password': 'パスワード',
    'common.role': '役割',
    'common.login': 'ログイン',
    'common.signup': '会員登録',
    'common.logout': 'ログアウト',
    'common.home': 'ホーム',
    'common.menu': 'メニュー',
    'common.close': '閉じる',

    // Auth
    'auth.login.title': '教育管理システム',
    'auth.login.enterUserId': 'IDを入力してください',
    'auth.login.processing': 'ログイン中...',
    'auth.login.failed': 'ログインに失敗しました',
    'auth.login.userNotFound': 'ユーザーが見つかりません',
    'auth.login.networkError': 'サーバーに接続できません。インターネット接続を確認してください。',
    'auth.signup.title': '会員登録',
    'auth.signup.academyId': 'アカデミーID',
    'auth.signup.userId': 'ユーザーID',
    'auth.signup.name': '名前',
    'auth.signup.role.teacher': '教師 (TEACHER)',
    'auth.signup.role.student': '生徒 (STUDENT)',
    'auth.signup.role.parent': '保護者 (PARENT)',
    'auth.signup.admissionDate': '入学日',
    'auth.signup.childId': '子供のID',
    'auth.signup.processing': '処理中...',
    'auth.signup.backToLogin': 'ログインに戻る',
    'auth.signup.success': '会員登録が完了しました。ログインしてください。',

    // Dashboard
    'dashboard.admin.title': '生徒管理',
    'dashboard.student.title': '生徒ダッシュボード',
    'dashboard.parent.title': '保護者ダッシュボード',
    'dashboard.welcome': 'こんにちは、{name}さん！',
    'dashboard.welcome.message': 'こんにちは、今日も一緒にお話ししましょう。',
    'dashboard.search.placeholder': '生徒名またはIDで検索...',
    'dashboard.filter.unresolvedOnly': '未解決のリスクのみ表示',
    'dashboard.recentActivity': '最近の活動',

    // Student Menu
    'student.menu.typeCheck': '性格診断テスト',
    'student.menu.typeCheck.desc': '自分の傾向と学習スタイルを知りましょう',
    'student.menu.chatbot': 'チャットボット相談',
    'student.menu.chatbot.desc': '気になることを自由に質問してください',
    'student.menu.matchingQa': 'マッチング質問回答',
    'student.menu.matchingQa.desc': '保護者からの質問に答えてください',
    'student.activity.typeCheck': '性格診断完了',
    'student.activity.chatbot': 'チャットボット相談',
    'student.menu.report.desc': '自分の性格診断結果を確認してみましょう',
    'student.menu.community':'チャットボット友達',
    'student.menu.community.desc':'チャットボットからの質問に答えてください',

    // Parent Menu
    'parent.menu.report.desc': 'お子様の性格診断結果を確認してください',
    'parent.menu.chatbot.desc': 'お子様の学習に関する相談をしてみましょう',
    'parent.childInfo': 'お子様の情報',
    'parent.childName': 'お子様の名前',
    'parent.noChildInfo': '登録されているお子様の情報がありません',
    'parent.chatbot.placeholder': 'お子様の学習について気になることを質問してください...',
    'parent.chatbot.error': 'メッセージの送信に失敗しました。もう一度お試しください。',

    // Student Chat
    'student.chatbot.placeholder': 'メッセージを入力してください...',
    'student.chatbot.send': 'メッセージを送信',
    'student.chatbot.error': 'メッセージの送信に失敗しました。もう一度お試しください。',
    'student.chatbot.response1': "はい、どうぞお話しください。お手伝いさせていただきます。",
    'student.chatbot.response2': "興味深いお話ですね。もう少し詳しく教えていただけますか？",
    'student.chatbot.response3': "なるほど。お役に立てそうな提案をさせていただきます。",
    'student.chatbot.response4': "良い質問ですね。一緒に考えてみましょうか？",

    // Personality Test
    'personality.test.title': '性格診断テスト',
    'personality.test.section.title': 'セクション {section}',
    'personality.test.progress': '{current}/{total} 回答済み',
    'personality.test.answer.yes': 'はい',
    'personality.test.answer.no': 'いいえ',
    'personality.test.submit': '提出',
    'personality.test.processing': '結果分析中...',
    'personality.test.error': 'テスト提出中にエラーが発生しました',
    'personality.test.section.A': '規範性',
    'personality.test.section.B': '協調性',
    'personality.test.section.C': '論理性',
    'personality.test.section.D': '活動性',
    'personality.test.section.E': '安定性',
    'personality.test.section.S': 'ストレス',

    // Report
    'report.title': '性格診断レポート',
    'report.studentInfo': '生徒情報',
    'report.parentInfo': '保護者情報',
    'report.noParentInfo': '登録された保護者情報がありません',
    'report.list': 'レポート一覧',
    'report.date': '診断日',
    'report.result': '診断結果',
    'report.detail.title': '性格診断詳細レポート',
    'report.detail.analysis': '性格タイプ分析',
    'report.detail.primaryType': '主要傾向',
    'report.detail.secondaryType': '副次傾向',
    'report.detail.recommendations': 'カスタマイズ学習推奨',
    'report.detail.studentInfo': '生徒情報',
    'report.detail.testDate': '診断日',
    'report.detail.learningStyle': '学習スタイル',

    // Risk
    'risk.management': 'リスク要素の管理',
    'risk.studentInfo': '生徒情報',
    'risk.parentInfo': '保護者情報',
    'risk.status': 'リスク要素の状況',
    'risk.totalRisks': '総リスク要素',
    'risk.unresolvedRisks': '未解決',
    'risk.resolvedRisks': '解決完了',
    'risk.resolutionRate': '解決率',
    'risk.list': 'リスク要素リスト',
    'risk.enterResolution': '解決内容の入力',
    'risk.resolutionContent': '解決内容',
    'risk.resolutionPlaceholder': '解決策やアクションの内容を入力してください',
    'risk.markAsResolved': '解決処理',
    'risk.admissionDate': '直近のリスク検知',

    // personality type
    'personality.type.sumomo.desc': '活発で積極的で、他の人との交流が大好きです。',
    'personality.type.digital.desc': '論理的かつ体系的なアプローチを好み、効率性を重視します。',
    'personality.type.sumomo.rec1': 'グループ活動指向学習',
    'personality.type.sumomo.rec2': '発表とディスカッションの機会を提供する',
    'personality.type.sumomo.rec3': '実践的な問題解決活動',
    'personality.type.digital.rec1': 'オンライン学習ツールの活用',
    'personality.type.digital.rec2': 'データベースの学習方法',
    'personality.type.digital.rec3': '体系的な問題解決アプローチ',
  }
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'ko' || savedLocale === 'ja')) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[locale][key as keyof typeof translations[typeof locale]] || key;
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(`{${key}}`, value),
        translation
      );
    }
    return translation;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};