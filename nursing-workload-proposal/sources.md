# sources.md｜文獻、法規與授權查核清單

> 版本：v0.1（2026-10-15）｜性質：第一步查核工作稿，非正式引用清單
> 查核方式說明：本次執行環境之網路政策封鎖 PubMed、BMJ、Airiti、全國法規資料庫等網域之直接存取，
> **所有項目僅經搜尋引擎摘要／索引頁交叉比對，未逐頁閱讀全文**。
> 正式計畫書引用前，須由專人開啟原文逐條核對（見 `open_questions.md` Q-S 系列）。

## 狀態代碼

| 代碼 | 意義 |
|---|---|
| ✅ 已核 | 書目資訊（作者、年份、期刊、卷期、DOI/PMID）與關鍵內容於兩個以上獨立來源一致，或見於期刊／官方頁面摘要 |
| 🟡 部分 | 僅部分欄位確認，或僅見二手引用 |
| ❌ 未核 | 查無依據；不得寫入正式文件 |
| ⚠️ 更正 | 與交接規格（GPT 版）原述不符，需修正 |

---

## 一、ICU：NAS（Nursing Activities Score）

| ID | 書目 | 識別碼 | 狀態 | 本提案用途／重點 | 備註 |
|---|---|---|---|---|---|
| S-NAS-01 | Miranda DR, Nap R, de Rijk A, Schaufeli W, Iapichino G; TISS Working Group. Nursing activities score. *Crit Care Med.* 2003;31(2):374-382. | DOI 10.1097/01.CCM.0000045567.78801.CC；PMID 12576939 | ✅ 書目／🟡 PMID | NAS 原始文獻。15 國 99 間 ICU、2,041 位病人、6,451 個護理日；NAS 解釋 81% 護理時間（TISS-28 為 43%）。分數表示一名護理師 24 小時工時百分比，最高約 176.8%。 | PMID 僅見於二手參考文獻表，須人工開啟 PubMed 確認。「23 項」出自二手文獻（Padilha 2015），原始摘要未見此數字。 |
| S-NAS-02 | Padilha KG, Stafseth S, Solms D, et al. Nursing Activities Score: an updated guideline for its application in the Intensive Care Unit. *Rev Esc Enferm USP.* 2015;49(Spec):131-137. | DOI 10.1590/S0080-623420150000700019；PMID 26761703 | ✅ | 2015 操作指引。7 國 19 間 ICU、758 位病人，以 Delphi 法釐清 5 個易混淆項目。各國平均 NAS 從 44.5%（西班牙）到 101.8%（挪威）。 | 2024 年有勘誤：DOI 10.1590/1980-220X-REEUSP-2024-ER18en，引用時須一併列出。勘誤內容待讀。 |
| S-NAS-03 | Debergh DP, Myny D, Van Herzeele I, Van Maele G, Reis Miranda D, Colardyn F. Measuring the nursing workload per shift in the ICU. *Intensive Care Med.* 2012;38(9):1438-1444. | DOI 待補 | 🟡 | **以班別測量 NAS 的直接依據。** 每名護理師每班平均 NAS 85.5%（換算 24 小時為 54.7%），夜班及週末較低。 | ⚠️ 交接規格說「不能直接把 24 小時 NAS/100 當成每班人數」，方向正確但不完整：已有每班測量 NAS 的方法學，應列為班別模型的參考，而非全部留待自行研究。 |
| S-NAS-04 | 1 NAS 點 ≈ 14.4 分鐘（1440 分 ÷ 100） | 二手文獻（巴西多篇，如 SciELO *Acta Paul Enferm*、PMC4031889） | 🟡 | NAS 轉護理時數的常用慣例 | 由定義推導，Miranda 原文摘要未明寫；提案應寫「文獻慣用換算」，並以本院工時實測校正。 |
| S-NAS-05 | Margadant C, et al. The Nursing Activities Score per nurse ratio is associated with in-hospital mortality in the intensive care units of the Netherlands. *Crit Care Med.* 2020;48(1):3-9. | PMID 31841450 | ✅ 書目／🟡 完整標題 | NAS 負荷與結果。荷蘭 15 間 ICU：NAS/護理師比 >41 時院內死亡 OR 1.19；校正後 >61 時 OR 1.29；**病人數／護理師比與死亡無關**。 | 支持「ICU 不宜只看床護比」的論點。完整標題須以原文確認。 |
| S-NAS-06 | Fasoi G, et al. Assessment of nursing workload as a mortality predictor in ICU using the NAS scale. *IJERPH.* 2021;18(1):79. | DOI 10.3390/ijerph18010079 | ✅ | 希臘 3 間 ICU：死亡者 NAS 較高，但差異未達統計顯著。 | 屬反面／中性證據，應一併呈現，避免選擇性引用。 |
| S-NAS-07 | Batassini É, de Oliveira JLC, Beghetto MG. Demonstration of sizing nursing staff methods in intensive care. *Rev Lat Am Enfermagem.* 2025;33:e4410. | DOI 10.1590/1518-8345.7184.4410（另見 .4411，待確認） | ✅ | NAS 換算 ICU 人力的實作示範：平均 NAS 85.9%；不同算法及班制得出 140–176 人。 | 可說明「方法與班制假設不同，結果差異大」，正好支持做敏感度分析。 |
| S-NAS-08 | 沙丽、苏兰若。应用护理活动评估量表对ICU护理工作量的调查与分析。*中华护理杂志.* 2007;(7):591-594. | 維普 cqvip | 🟡 | 中國大陸簡體中文版 NAS 的翻譯與應用 | Cronbach's α 0.94、CVI 0.96 僅見於二手來源。**不是台灣繁體版**，不能直接沿用。 |
| S-NAS-09 | 〈加護單位護理工作內容之分佈與工作量之探討〉*彰化護理.* 2020;27(1):7-16. | DOI 10.6647/CN.202003_27(1).0004 | ✅ 題名卷期／❌ 作者 | **台灣 NAS 應用研究**：橫斷式、立意取樣；各 ICU 的 NAS 均 >50%；直接護理占 83.0–87.3%。 | ⚠️ 屬「應用」研究，**不是量表翻譯或驗證研究**。作者與樣本數待讀全文。 |
| S-NAS-10 | Hilaris 研討會摘要：Validation of Nursing Activity Score and Nursing Equivalent Manpower Use Scale in Taiwan ICUs… | hilarispublisher.com proceedings 18665 | 🟡 | 台灣 NAS／NEMS 效度研究線索：台灣 ICU 病人 NAS 偏高，專家估計時間與實測不一致。 | ⚠️ 搜尋摘要顯示作者為 **Yann-Fen Chao（趙艷芬）**，**不是規格所寫的「邱艶芬」**；年份推測為 2017，待確認。屬研討會摘要，證據等級低。 |
| S-NAS-11 | Chang LY, Yu HH, Chao YFC. The relationship between nursing workload, quality of care, and nursing payment in ICUs. *J Nurs Res.* 2019;27(1). | DOI 10.1097/jnr.0000000000000265 | ✅ | 台灣 ICU 工作量、照護品質與護理給付 | ⚠️ 使用 **TISS-28，不是 NAS**，引用時不得寫成 NAS 研究。 |
| S-NAS-12 | Lee A, et al. Are high nurse workload/staffing ratios associated with decreased survival in critically ill patients? *Ann Intensive Care.* 2017;7:46. | DOI 10.1186/s13613-017-0269-2 | ✅ | 香港研究：工作負荷／人力比值 ≥52 時，存活 OR 0.35。 | ⚠️ 以 **TISS-76** 測量，不是 NAS。 |
| S-NAS-13 | NAS 授權／著作權 | — | ❌ | 未找到官方授權條款或收費機制 | 其他國家的做法是向原作者取得書面同意，譯本送原作者審閱（拉脫維亞研究 PMC11507993）。2003 年原文版權屬 LWW。 |

## 二、普通病房：RAFAELA®／OPCq／PAONCIL

| ID | 書目 | 識別碼 | 狀態 | 本提案用途／重點 | 備註 |
|---|---|---|---|---|---|
| S-RAF-01 | Fagerström L, Kinnunen M, Saarela J. Nursing workload, patient safety incidents and mortality: an observational study from Finland. *BMJ Open.* 2018;8(4):e016367. | DOI 10.1136/bmjopen-2017-016367；PMC5922465 | ✅ | 4 家醫院、36 個單位，1 年共 12,475 個資料點。負荷高於最適水準時：病安事件 OR 1.24（1.08–1.42）、死亡 OR 1.43（1.18–1.73）。 | ⚠️ 低於最適時死亡 OR 0.78（0.60–1.00）**不顯著**。作者結論是 RAFAELA 指標只比「病人數／護理師」**略佳**，淨效益無法判定優劣，需重複驗證。**提案不得寫成「明顯優於護病比」**，媒體「死亡風險增 40%」之說也不得引用。最適區間 ±15%，待讀全文確認。 |
| S-RAF-02 | Rauhala A, Fagerström L. Determining optimal nursing intensity: the RAFAELA method. *J Adv Nurs.* 2004;45(4):351-359. | DOI 10.1046/j.1365-2648.2003.02918.x | ✅ 書目／🟡 頁碼 | PAONCIL 迴歸法：以 OPC/nurse 對 PAONCIL 平均值做迴歸，PAONCIL＝0 時的點數即為該單位最適值。 | 頁碼待確認 |
| S-RAF-03 | Fagerström L, et al. 驗證 OPC 效度之研究。*J Adv Nurs.* 2000. | DOI 10.1046/j.1365-2648.2000.01277.x | 🟡 | OPC 效度 | 完整作者、題名、頁碼待讀原文 |
| S-RAF-04 | Liljamo P, Kinnunen UM, Ohtonen P, Saranto K. Quality of nursing intensity data: inter-rater reliability of the patient classification after two decades in clinical use. *J Adv Nurs.* 2017;73(9):2248-2259. | DOI 10.1111/jan.13288 | ✅ | 評分者間信度：等級層級為「可靠至近乎完美」；一致性最低的是「計畫與協調」及「指導／延續照護與情緒支持」兩個面向。 | 「共識率 70.8%」為二手引用，待確認 |
| S-RAF-05 | Junttila JK, et al. Hospital mortality and optimality of nursing workload: a study on the predictive validity of the RAFAELA nursing intensity and staffing system. *Int J Nurs Stud.* 2016;60:46-53. | PMID 27297367 | ✅ 書目／🟡 作者名 | 2 家醫院 34 個單位，732 個單位月。以人力過多月為參考：最適月死亡 IRR 4.79，人力不足月 IRR 12.97。 | 信賴區間很寬（2.86–58.88）；護病比與死亡的關聯方向與多數大型研究相反。屬重要但需審慎解讀的證據。 |
| S-RAF-06 | Fagerström L, Lønning K, Andersen MH. The RAFAELA system: a workforce planning tool for nurse staffing and human resource management. *Nurs Manag (Harrow).* 2014;21(2):30-36. | DOI 10.7748/nm2014.04.21.2.30.e1199 | ✅ | 系統三要素（OPCq、人力登錄、PAONCIL）概述 | 屬實務概述，**不是驗證研究** |
| S-RAF-07 | OPCq 結構：6 面向，各評 A–D（1–4 分），總分 6–24；等級 I 6–8、II 9–12、III 13–15、IV 16–20、V 21–24 | PMC5867286；DOI 10.1177/1460458218813613；ScienceDirect S0964339706001212 | ✅ | 普通病房模型的結構參考 | 6 面向英文名稱各文獻用字略有差異，**以 FCG 官方手冊為準**；未取得授權前不得重製題目與評分說明。 |
| S-RAF-08 | PAONCIL：護理師逐班以 −3 到 +3 評估負荷（0＝最適），每次期間 4–8 週；另含 12 項非病人因素。品質門檻：回覆率 >70%、期間 ≥3–4 週、R² >25% 等。 | PMC4090478；PMC5762709；ResearchGate 261999512 | ✅（片段） | 單位最適值校正程序 | 門檻數值待讀原文。⚠️ 文獻中**查無「±0.5 區間」**，不得使用。 |
| S-RAF-09 | 所有權與授權：RAFAELA® 由芬蘭地方及區域政府協會（Kuntaliitto）擁有，FCG（FCG Konsultointi Oy）管理並有獨家簽約權；使用須付費授權，且每年須做評分者間信度測試。 | PMC5922465；赫爾辛基市議決 2017、2018 | ✅ | 授權路徑 | ⚠️ 規格寫「確認權利人」，查核結果：權利人為 Kuntaliitto，**窗口為 FCG**。赫爾辛基 2017 年 22 個單位的年費為 26,880 歐元（未稅），屬舊價格，僅供估算數量級。 |
| S-RAF-10 | 中文版 OPCq／RAFAELA | — | ❌（查無） | — | 查無中文版或亞洲正式改編版。韓國有參考 OPC 自行設計的分類系統（Ko et al., *Nursing Open* 2021, DOI 10.1002/nop2.845）。 |
| S-RAF-11 | OPC 由 Kaustinen 於 1995 年發展 | — | ❌ | — | 查無依據。僅知 OPC 源自 1991–93 年奧盧大學醫院的 HSSG 分類（PMC8363350）。不得寫入。 |
| S-RAF-12 | 限制：PAONCIL 屬主觀評估，最適值依單位而異、無法跨院比較；有研究顯示僅 9% 單位達到 PAONCIL 品質門檻 | PMC5762709；PMID 19531142 | ✅（片段） | 風險章節 | — |

## 三、人力換算方法與通用證據

| ID | 書目／來源 | 狀態 | 用途 | 備註 |
|---|---|---|---|---|
| S-STF-01 | 巴西 COFEN Resolução 543/2017：每位病人 24 小時護理時數（最低照護 4h、中度 6h、高依賴 10h、半加護 10h、加護 18h）；技術安全指數（IST）≥15%；公式 QP＝THE×KM，KM＝DS×(1+IST)/CHS | ✅（543 條文與手冊）／🟡（IST 細項） | 「時數 × 人力係數」換算骨架的國際範例 | ⚠️ **543/2017 已於 2024-03-12 被 Resolução 743/2024 廢止**，只能寫成「已廢止之方法學參考」。現行 Parecer Normativo 1/2024 的內容尚未查到。 |
| S-STF-02 | UK Safer Nursing Care Tool（SNCT）乘數：Level 0＝0.99、1a＝1.39、1b＝1.72、2＝1.97、3＝5.96 WTE/床（2013–15 版），**已內含 22% 寬裕係數** | ✅ | 對照用 | ⚠️ 授權由 Imperial College 代 Shelford Group 管理，英格蘭以外須另洽，**不得直接引用乘數表做本院計算**。如用 SNCT 乘數，不得再乘休假寬裕係數。 |
| S-STF-03 | Griffiths P, et al. SNCT 評估研究。*Health Serv Deliv Res.* 2020;8(16)（NBK555316；PMID 32223117） | ✅ | **以高百分位而非平均值訂定編制**；26% 的病房日人力不足 ≥15%；低編制省下的錢主要來自人力不足 | 支持「平均值不足以應付變異」 |
| S-STF-04 | NICE SG1（2014）：日班每位 RN 照顧 >8 名病人為警訊，**不是**最低護病比 | ✅ | 國際對照 | — |
| S-STF-05 | 英國 NQB 2018 寬裕係數建議 22%；87 家 trust 實際不可出勤比例 16–34%（Sheffield Hallam, *Are Headrooms Realistic*） | ✅ | 支持「寬裕係數須以本院資料計算」 | 不宜直接套用 22% |
| S-STF-06 | Westbrook JI, et al. *BMC Health Serv Res.* 2011;11:319 | ✅ | 直接照護只占 20.4–24.8%；與病人同在的時間為 37% | ⚠️ 37% 不是直接照護比例 |
| S-STF-07 | Aiken LH, et al. *Lancet.* 2014;383:1824-30（RN4CAST） | ✅ | 每位護理師多照顧 1 名病人，30 天死亡 OR 1.068（1.031–1.106） | 應寫 OR，不寫「死亡率增加 7%」 |
| S-STF-08 | Griffiths P, et al. *BMJ Qual Saf.* 2019;28:609-617 | ✅ | RN 人力低於病房平均的日數每多一天，死亡 aHR 1.03 | ⚠️ 以「日」為層級，不是「班」 |
| S-STF-09 | Needleman J, et al. *N Engl J Med.* 2011;364:1037-45 | ✅ | **班層級**：RN 人力低於目標 ≥8 小時的班，每暴露一班 HR 1.02；高周轉班 HR 1.04 | 班別監測的證據 |
| S-STF-10 | Ball JE, et al. *BMJ Qual Saf.* 2014;23:116-125；Ausserhofer D, et al. *BMJ Qual Saf.* 2014;23(2):126-135；Griffiths P, et al. *J Adv Nurs.* 2018;74(7):1474-87；Kalisch BJ, Williams RA. *JONA.* 2009;39(5):211-219（MISSCARE） | ✅ | 漏失照護（missed care）指標 | ⚠️ Ball 2014 是英國單國研究，不是 RN4CAST 多國研究 |

## 四、台灣法規與政策（查核日 2026-10-15）

> ⚠️ 全國法規資料庫無法連線，以下均依官方公報與衛福部、健保署網址的搜尋摘要比對。**送件前須逐條核對現行條文。**

| ID | 法規／政策 | 內容 | 狀態 | 來源 | 日期 |
|---|---|---|---|---|---|
| S-LAW-01 | 醫療機構設置標準 §12-1（全日平均護病比） | 急性一般病床：醫學中心 1:9、區域醫院 1:12、地區醫院 1:15，按月平均 | ✅ | mohw.gov.tw dl-100832；cp-2651-19783-1 | 108.2.1 發布，108.5.1 施行 |
| S-LAW-02 | 醫療機構設置標準 附表（加護病床） | 每床 ≥1.5 名護理人員 | 🟡 | 行政院公報 eg026214 | 待核現行版 |
| S-LAW-03 | 三班護病比（衛福部公告） | 醫學中心 1:6／1:9／1:11；區域醫院 1:7／1:11／1:13；地區醫院 1:10／1:13／1:15（白班／小夜／大夜） | ✅ | mohw.gov.tw cp-6656-77368-1；nhi.gov.tw dl-84803 | 113.1.26 公告，113.3.1 實施 |
| S-LAW-04 | 醫療法 §12 修正、增訂 §102-1（三班護病比入法、罰則） | 三班護病比由中央主管機關訂定，每 3 年檢討；罰鍰依醫院層級分級，滿 1 年未改善可停業 | ✅ 三讀／🟡 罰鍰級距 | 行政院公報 eg032104；中央社 202605080198 | 115.5.8 三讀；115.5.15 公布（待核） |
| S-LAW-05 | 醫療機構設置標準 §12-1、§23 修正草案 | 據報導：全月平均；護理長、專科護理師不計入；醫院每月公告；分階段施行，醫學中心 116.5.20、區域醫院 117.1.1、地區醫院 117.5.1 | 預告 ✅／細節 🟡 | 衛部醫字第1151665340號 | 115.6.9 預告 |
| S-LAW-06 | 上項草案是否已正式發布 | — | ❌ | — | **待查（高優先）** |
| S-LAW-07 | 三班護病比達標獎勵 | 114.7 起三班全部達標，當月住院護理費加成 10%；115 年維持 | ✅ | nhi.gov.tw；mohw.gov.tw cp-16-82863-1 | 114.5.6 公告 |
| S-LAW-08 | 健保住院護理費與全日護病比連動 | 107.12.1 起加成 2–20% | 🟡 | mohw.gov.tw cp-16-45965-1 | 各層級對照表待查 |
| S-LAW-09 | 勞基法 §30、§30-1、§32、§34、§36–38 | 醫療保健服務業已被指定可採 4 週變形工時（86.12.8 函）；延長工時每月 ≤46 小時（經同意可 54／每 3 個月 138）；輪班間隔 ≥11 小時；特休依年資計 | ✅（§34 例外行業 🟡） | mol.gov.tw | 最新修正 113.7.31 |
| S-LAW-10 | 勞基法適用對象 | 依公務人員法令進用者、聘用條例人員不適用；軍職人員不適用；國軍醫院基金聘雇人員（含民診聘雇）自 87.7.1 起適用勞基法（監察院報告） | 🟡 | mol.gov.tw；cy.gov.tw；law.mnd.gov.tw | **本院人員身分組成須由人事確認** |
| S-LAW-11 | 護理人力政策整備中長程計畫（114–117） | 12 項策略，每年約 68.8 億元；夜班獎勵：小夜每班 400–600 元、大夜每班 600–1,000 元 | ✅ | mohw.gov.tw cp-16-80120-1；cp-6656-77368-1 | 113.7 核定 |
| S-LAW-12 | 人體研究法 §4、§5；得免倫審公告 | 研究須經 IRB 審查；是否得免審由 IRB 判定，研究者不能自行認定 | ✅／🟡（公告文號） | — | 108.1.2 |
| S-LAW-13 | 個資法 §6（特種個資） | 醫療資料原則上禁止蒐集、處理、利用，例外包括學術研究且無從識別當事人等；2025 修正之施行日待定 | 🟡 | pdpc.gov.tw | 114.11.11 公布 |

## 五、尚未取得之輸入文件

| ID | 文件 | 狀態 |
|---|---|---|
| S-IN-01 | 《北歐_RAFAELA與ICU_NAS_護理負荷指標整理.docx》 | ❌ **未上傳**。本次只收到交接規格的 .md 與 .docx，兩者內容相同。 |
