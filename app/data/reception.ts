export type MajorAward = {
  organization: "Emmy" | "Golden Globe" | "Peabody" | "SAG" | "TCA";
  year: number;
  category: string;
  ceremonyDate?: string;
  recipient?: string;
  sourceUrl?: string;
};

export type ExternalReception = {
  audience: string;
  critics: string;
  awards: MajorAward[];
  imdb: string;
  reddit: string;
  awardsUrl: string;
};

const sources = (query: string, imdb: string) => ({
  imdb: `https://www.imdb.com/title/${imdb}/reviews/`,
  reddit: `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
  awardsUrl: `https://www.televisionacademy.com/search?search_api_fulltext=${encodeURIComponent(query)}`,
});

export const externalReception: Record<string, ExternalReception> = {
  "The Wire": {
    audience: "觀眾常把它形容為需要耐心進入、卻極有回報的慢熱作品；群像厚度、制度觀察與重看價值最常受到稱讚。",
    critics: "影評尤為肯定小說式長篇結構、自然主義表演與對白，以及多條人物線如何被剪輯成完整的城市剖面。",
    awards: [{ organization: "Peabody", year: 2003, category: "Peabody Award", sourceUrl: "https://peabodyawards.com/award-profile/the-wire/" }],
    ...sources("The Wire HBO", "tt0306414"),
  },
  "Six Feet Under": {
    audience: "觀眾普遍認同它對家庭、死亡與哀傷的坦率；黑色幽默和角色的真實缺陷，讓它成為許多人會在人生不同階段重看的作品。",
    critics: "影評著重群戲的細膩層次、夢境與現實交錯的導演手法，以及編劇如何讓黑色喜劇和家庭劇自然共存。",
    awards: [
      { organization: "Emmy", year: 2002, category: "戲劇類最佳導演", recipient: "Alan Ball" },
      { organization: "Emmy", year: 2002, category: "最佳片頭主題音樂", recipient: "Thomas Newman" },
      { organization: "Emmy", year: 2006, category: "戲劇類最佳客串女演員", recipient: "Patricia Clarkson" },
    ],
    ...sources("Six Feet Under HBO", "tt0248654"),
  },
  "Breaking Bad": {
    audience: "觀眾高度投入它逐步累積的張力、黑色幽默與道德難題；節奏控制和角色之間的化學反應是最常被提起的優點。",
    critics: "評論界肯定劇本的因果精度、構圖與色彩設計、剪輯節奏，以及 Bryan Cranston 與 Aaron Paul 具層次的表演。",
    awards: [
      { organization: "Emmy", year: 2013, category: "最佳戲劇類影集" },
      { organization: "Emmy", year: 2014, category: "最佳戲劇類影集" },
      { organization: "Emmy", year: 2014, category: "戲劇類最佳編劇", recipient: "Moira Walley-Beckett" },
    ],
    ...sources("Breaking Bad AMC", "tt0903747"),
  },
  "Mad Men": {
    audience: "喜愛者著迷於人物細節、時代氛圍與大量留白；不習慣慢節奏的觀眾，則較容易覺得事件推進不夠明顯。",
    critics: "影評普遍讚賞精準的場面調度、服裝與美術考據、克制表演，以及對白之下持續流動的心理暗線。",
    awards: [2008, 2009, 2010, 2011].map(year => ({ organization: "Emmy" as const, year, category: "最佳戲劇類影集" })),
    ...sources("Mad Men AMC", "tt0804503"),
  },
  "The Sopranos": {
    audience: "觀眾常被黑色幽默、家庭日常與道德矛盾吸引；角色是否值得同情，至今仍能引發截然不同的解讀。",
    critics: "評論界視 James Gandolfini 的表演為電視演技的重要突破，也肯定編劇把心理劇、家庭劇和黑幫類型融為一體。",
    awards: [
      { organization: "Peabody", year: 2000, category: "Peabody Award" },
      { organization: "Emmy", year: 2004, category: "最佳戲劇類影集" },
      { organization: "Emmy", year: 2007, category: "最佳戲劇類影集" },
    ],
    ...sources("The Sopranos HBO", "tt0141842"),
  },
  "Watchmen": {
    audience: "熟悉原作的觀眾多半欣賞它選擇擴寫世界，而非重述舊故事；複雜時間線與政治寓言則帶來一定的進入門檻。",
    critics: "影評肯定 Regina King 的核心表演、非線性編劇、聲音與配樂設計，以及類型娛樂和歷史題材之間的形式實驗。",
    awards: [{ organization: "Emmy", year: 2020, category: "最佳有限影集" }],
    ...sources("Watchmen HBO series", "tt7049682"),
  },
  "Succession": {
    audience: "觀眾喜愛尖銳台詞、黑色幽默與高密度的權力角力；角色普遍不討喜，也正是它最吸引人或最令人卻步的地方。",
    critics: "評論界高度肯定編劇室的台詞節奏、群戲默契、手持攝影與 Nicholas Britell 帶有古典悲劇感的配樂。",
    awards: [
      { organization: "Emmy", year: 2020, category: "最佳戲劇類影集" },
      { organization: "Emmy", year: 2022, category: "最佳戲劇類影集" },
      { organization: "Emmy", year: 2023, ceremonyDate: "2024-01-15", category: "最佳戲劇類影集" },
    ],
    ...sources("Succession HBO", "tt7660850"),
  },
  "Band of Brothers": {
    audience: "觀眾普遍被戰友情感、歷史質感與人物的真實重量打動；龐大的角色群需要一些時間辨認。",
    critics: "影評肯定戰場調度、實景與音效、群戲表演，以及攝影如何在宏大場面中仍保留個體視角。",
    awards: [
      { organization: "Emmy", year: 2002, category: "最佳迷你影集" },
      { organization: "Golden Globe", year: 2002, category: "最佳迷你影集或電視電影" },
    ],
    ...sources("Band of Brothers HBO", "tt0185906"),
  },
  "The Americans": {
    audience: "忠實觀眾常稱讚它的慢燒張力、婚姻與信念的交織，以及角色關係中長期累積的細微變化。",
    critics: "影評著重 Matthew Rhys 與 Keri Russell 的內斂表演、精準剪輯和時代配樂，以及不靠大量動作仍能維持懸念的編劇。",
    awards: [
      { organization: "Emmy", year: 2018, category: "最佳戲劇類男主角" },
      { organization: "Emmy", year: 2018, category: "最佳戲劇類編劇" },
      { organization: "Peabody", year: 2015, category: "Peabody Award" },
      { organization: "Peabody", year: 2018, category: "Peabody Award" },
    ],
    ...sources("The Americans FX", "tt2149175"),
  },
  "Fargo": {
    audience: "觀眾喜愛荒謬犯罪、地域氣質與黑色幽默；各季故事與人物獨立，也讓不同季度的偏好落差相當明顯。",
    critics: "評論界肯定選集式編劇、雪景攝影、節奏與音樂運用，以及演員如何在誇張語調和真實情感間取得平衡。",
    awards: [
      { organization: "Emmy", year: 2014, category: "最佳迷你影集" },
      { organization: "Golden Globe", year: 2015, category: "最佳迷你影集或電視電影" },
    ],
    ...sources("Fargo FX series", "tt2802850"),
  },
  "Fleabag": {
    audience: "觀眾高度認同它把羞恥、慾望、孤獨和悲傷寫得既殘酷又好笑；短小篇幅也讓情緒密度格外集中。",
    critics: "影評讚賞 Phoebe Waller-Bridge 的編劇與表演，以及打破第四面牆如何從喜劇技巧發展成角色心理的一部分。",
    awards: [
      { organization: "Emmy", year: 2019, category: "最佳喜劇類影集" },
      { organization: "Emmy", year: 2019, category: "最佳喜劇類女主角" },
      { organization: "Emmy", year: 2019, category: "最佳喜劇類編劇" },
    ],
    ...sources("Fleabag BBC", "tt5687612"),
  },
  "Chernobyl": {
    audience: "觀眾普遍讚賞壓迫感、表演與災難細節，也常把它視為進一步理解事件背景的起點；史實取捨則持續受到討論。",
    critics: "評論界肯定 Craig Mazin 的緊密劇本、Jared Harris 等人的群戲、灰冷攝影，以及 Hildur Guðnadóttir 令人不安的聲音設計。",
    awards: [{ organization: "Emmy", year: 2019, category: "最佳有限影集" }],
    ...sources("Chernobyl HBO", "tt7366338"),
  },
  "Twin Peaks": {
    audience: "觀眾對怪誕幽默、夢境、小鎮氛圍和謎團有強烈依戀；不解釋與節奏起伏則一直是最常見的分歧。",
    critics: "評論界肯定 David Lynch 的超現實導演、Angelo Badalamenti 的標誌性配樂、獨特聲音設計，以及類型混搭的突破。",
    awards: [
      { organization: "Emmy", year: 1990, category: "最佳服裝設計" },
      { organization: "Emmy", year: 1990, category: "單鏡頭最佳剪輯" },
    ],
    ...sources("Twin Peaks series", "tt0098936"),
  },
  "The X-Files": {
    audience: "觀眾長期喜愛兩位主角的默契、單元怪談的想像力與陰謀氣氛；長篇主線的複雜度則較容易形成分歧。",
    critics: "影評肯定 Gillian Anderson 與 David Duchovny 的化學反應、電影感攝影、Mark Snow 的配樂，以及程序劇和科幻恐怖的融合。",
    awards: [
      { organization: "Emmy", year: 1996, category: "戲劇類最佳編劇", recipient: "Darin Morgan" },
      { organization: "Emmy", year: 1997, category: "戲劇類最佳女主角", recipient: "Gillian Anderson" },
      { organization: "Emmy", year: 1997, category: "影集類最佳攝影" },
    ],
    ...sources("The X-Files", "tt0106179"),
  },
  "The West Wing": {
    audience: "觀眾喜歡快速對白、理想主義與團隊默契；高密度政策資訊和偏浪漫的政治視角，也可能成為進入門檻。",
    critics: "評論界讚賞 Aaron Sorkin 的語言節奏、走廊長鏡頭、群像調度與演員接力般的對白表演。",
    awards: [2000, 2001, 2002, 2003].map(year => ({ organization: "Emmy" as const, year, category: "最佳戲劇類影集" })),
    ...sources("The West Wing NBC", "tt0200276"),
  },
  "The Shield": {
    audience: "觀眾被高壓節奏、道德灰區與持續升高的緊張感吸引；粗礪影像風格則有人視為特色、也有人較難適應。",
    critics: "影評視 Michael Chiklis 的表演為關鍵突破，也肯定手持攝影、近乎紀錄片的即時感與緊密的因果編劇。",
    awards: [
      { organization: "Emmy", year: 2002, category: "最佳戲劇類男主角" },
      { organization: "Golden Globe", year: 2003, category: "最佳戲劇類影集" },
      { organization: "Peabody", year: 2005, category: "Peabody Award" },
    ],
    ...sources("The Shield FX", "tt0286486"),
  },
  "Lost": {
    audience: "觀眾著迷於人物群像、謎團和共同猜測的參與感；對答案密度與敘事方向的期待差異，長期形成兩極評價。",
    critics: "評論界肯定試播集的電影級製作、非線性編劇、Michael Giacchino 的配樂，以及龐大群戲的選角與調度。",
    awards: [
      { organization: "Emmy", year: 2005, category: "最佳戲劇類影集" },
      { organization: "Emmy", year: 2005, category: "戲劇類最佳導演", recipient: "J.J. Abrams" },
      { organization: "Emmy", year: 2005, category: "最佳原創配樂", recipient: "Michael Giacchino" },
    ],
    ...sources("Lost ABC", "tt0411008"),
  },
  "The Office": {
    audience: "觀眾對角色陪伴感、尷尬幽默與可反覆觀看性評價很高；不同時期的喜劇風格變化，則各有擁護者。",
    critics: "影評肯定群戲節奏、即興感與鏡頭反應，也認為美版逐步把英版形式轉化成更溫暖、適合長篇發展的職場喜劇。",
    awards: [{ organization: "Emmy", year: 2006, category: "最佳喜劇類影集" }],
    ...sources("The Office US NBC", "tt0386676"),
  },
  "Arrested Development": {
    audience: "觀眾喜愛密集伏筆、旁白和層層回收的笑點，也常認為需要重看才能真正接住；不同製作時期的評價有所落差。",
    critics: "評論界讚賞非線性剪輯、旁白、群戲與高度連鎖的編劇結構，笑點密度遠超當時多數情境喜劇。",
    awards: [{ organization: "Emmy", year: 2004, category: "最佳喜劇類影集" }],
    ...sources("Arrested Development", "tt0367279"),
  },
  "Battlestar Galactica": {
    audience: "觀眾投入生存壓力、政治辯論與角色關係；後期更偏宗教與神話的語調，則是最常見的口味分歧。",
    critics: "影評肯定 Edward James Olmos 與 Mary McDonnell 的表演、手持攝影、Bear McCreary 的跨文化配樂與連續劇編劇野心。",
    awards: [
      { organization: "Peabody", year: 2005, category: "Peabody Award", sourceUrl: "https://peabodyawards.com/award-profile/battlestar-galactica/" },
      { organization: "Emmy", year: 2007, category: "影集類最佳視覺效果" },
      { organization: "Emmy", year: 2009, category: "影集類最佳音效剪輯" },
    ],
    ...sources("Battlestar Galactica 2004", "tt0407362"),
  },
};
