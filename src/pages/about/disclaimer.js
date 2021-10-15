import React from 'react';
import { getItem} from '../../utils/storage'

export const Disclaimer = () => {

    return (
        <>
        {getItem('language') === 'zh-tw' && <>
        <h2>使用者條款與免責聲明</h2>

        <h3>原則</h3>
        <ol>
            <li>akaSwap akaSwap 成立宗旨為發展透明之交易平台，以協助數位藝術家更加穩定、安全地銷售自我創作之作品，並使收藏家們得更有效率地接觸更多藝術創作。</li>
            <li>當您使用 akaSwap 並開始使用我們的各項服務前，應仔細閱讀、瞭解本「使用者條款與免責聲明」，有任何疑問敬請迅速聯絡我們。當您開始使用akaSwap 各項服務時，即視為您已經充分審閱、瞭解及同意本使用者條款，並同意遵守以下所列條款之內容，並願意負擔相應之義務與責任。</li>
            <li> 本網站有權於任何時間修改或變更本使用條款之內容，您於每次使用本網站服務前，應仔細查看以瞭解您當前之權利與義務。本網站保有任何修改或變更本使用條款之權限，若本網站修改或變更本使用條款後您仍繼續使用本服務，視為您已同意接受本使用條款之修改及變更。</li>
            <li>本使用者條款與 akaSwap 發布之其他特殊條款相矛盾時，以附加條件或特殊條款為準。當本使用者條款之一部無效時，其他部分仍具有效力。</li>
            <li>akaSwap 服務的具體內容根據實際情況而定，本公司並對其所提供之服務擁有最終解釋權。</li>
            <li>您同意本公司有權隨時變更、終止部分或全部 akaSwap 的服務，您亦可隨時停止接受 akaSwap 的服務。</li>
            <li>如果您未成年，您必須取得法定代理人同意，才能使用 akaSwap 之服務，並請與您的法定代理人一起閱讀本使用者條款；如果您是允許未成年子女使用akaSwap 服務的法定代理人，您必須遵守本條款，並為您子女在這些服務中的所有活動負責。</li>
        </ol>

        <h3>使用者行為 </h3>
        <ol>
            <li>
                您在使用本網站服務過程中，必須遵循以下原則：
                <ol>
                    <li>遵守中華民國之法律、法規、命令等規範；</li>
                    <li>本使用者條款之規範；</li>
                    <li>遵守所有與網路服務有關的網路協定、規定和程式；</li>
                    <li>不得為任何非法目的而使用本網路之服務；</li>
                    <li>不得使用任何設備、軟體、程序或其他方式，干擾或試圖干擾本網站之正常運作；</li>
                    <li>不得使用可能對平台造成損壞、禁用、負擔過重或損害服務的功能；</li>
                    <li>不允許侵入、強行入侵、接通、使用或企圖侵入、接通、使用本網站伺服器及未經本網站對您發出許可的任何資料區，包含但不限於變更、刪除或蒐集他人之任何資料等；</li>
                    <li>不得限制、制止其他使用者使用並享用本服務。</li>
                </ol>
            </li>
            <li>
                若您為使用 akaSwap 的藝術創作者，基於有效運作 akaSwap 的服務，您授權本公司以下事項：
                <ol>
                    <li>管理、重製、散布、傳播及使用您的內容；</li>
                    <li>修改您的內容以及根據您的內容創作衍生作品，例如重新設定您的內容格式或進行翻譯。</li>
                </ol>
            </li>
        </ol>

        <h3>使用者非法行為禁止與免責聲明</h3>
        <ol>
            <li>我們再次聲明 akaSwap 為僅提供藝術創作者與收藏家交易之平台，我們不提供以下任何相關業務，亦不會有任何洗錢、恐怖組織資金活動等非法行為：
                <ol>
                    <li>虛擬通貨與新臺幣、外國貨幣及大陸地區、香港或澳門發行之貨幣間之交換。</li>
                    <li>虛擬通貨間之交換。</li>
                    <li>進行虛擬通貨之移轉。</li>
                    <li>保管、管理虛擬通貨或提供相關管理工具。</li>
                    <li>參與及提供虛擬通貨發行或銷售之相關金融服務。</li>
                    <li>使用者註冊功能。</li>
                </ol>
            </li>
            <li>您必須有合法使用之電子錢包，以及足夠的虛擬貨幣 Tezos，才能在akaSwap 上進行交易與各項服務，此外，於 akaSwap 上進行的所有交易，皆會紀錄並揭露於 Tezos 區塊鏈上，以達成安全、透明之交易目的。</li>
            <li>因此，若您基於任何非法目的（包括但不限於洗錢、非法賭博、恐怖組織之資金活動、惡意駭客行動等），而不當使用本網站，則您應自行負擔所有責任，與 akaSwap 平台或本公司無涉，特此聲明。</li>
        </ol>

        <h3>智慧財產權與使用者鑄造行為</h3>
        <ol>
            <li>本網站提供的服務內容(包括但不限於：文字、照片、圖形、圖像、圖表、聲音、FLASH 動畫、視頻、音頻、商標等)，均由 akaSwap 或其他相關權利人如藝術創作者等，依法擁有，並受著作權法、商標法等智慧財產權法規之保護。</li>
            <li>非經本網站或其他相關權利人之事先書面同意，本網站及其內容之任何部分，不能修改、複製、重製、重印、公開播送、改作、散佈、發行、公開發表及為任何非法目的之使用。</li>
            <li>
                當您開始使用 akaSwap 平台，並進行鑄造或上架前，您同意您將遵守以下條款：
                <ol>
                    <li>您不會鑄造或上架未經著作權人同意或授權之作品。</li>
                    <li>您不會鑄造或上架您明知為侵害著作權或製版權之作品。</li>
                    <li>您不會鑄造或上架未經著作人同意或授權之衍生著作。</li>
                    <li>您不會冒充他人或創建具誤導性之用戶名稱。</li>
                    <li>您不會以其他任何方式，侵害他人之著作權、製版權、商標權、隱私權或其他權利。</li>
                    <li>除特殊情事外，您亦不會於 akaSwap 上鑄造或上架已經於其他區塊鍊或平台上鑄造之作品；您於 akaSwap 上鑄造或上架作品後，亦不會於其他區塊鍊或平台上鑄造相同之作品。</li>
                    <li>您不會重複鑄造相同或類似之作品。</li>
                    <li>
                        akaSwap 尊重創作過程與藝術自由，但除前述項目外，您創作、鑄造或上架之作品不得包含以下內容：
                        <ol>
                            <li>任何違反法律或侵害他人權利（包括著作權、製版權、商標權、隱私權或其他權利）之內容；</li>
                            <li>任何涉及色情、猥褻或引起他人反感之內容；</li>
                            <li>任何涉及歧視性或仇恨性言論之內容。</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>若使用者違反前條規範，應由使用者自負致生之所有責任，與 akaSwap、本公司無涉。</li>
            <li>akaSwap 得自行決定拒絕或刪除其認為違反本使用者條款之創作者作品。</li>
        </ol>

        <h3>停權與求償</h3>
        <ol>
            <li>
                若您在使用 akaSwap 服務過程中有下列行為，本公司有權立即終止或禁止您使用 akaSwap 之任何權限，若有任何損害並得基於相關法律規定向您求償：
                <ol>
                    <li>違反前揭使用者行為章節之任何條文；</li>
                    <li>違反前揭洗錢行為禁止與免責聲明章節之任何條文；</li>
                    <li>違反智慧財產權章節之任何條文；</li>
                    <li>本公司認定您有其他不當使用本網站之行為；</li>
                    <li>本公司認定您有任何違反法律、法規之疑慮時；</li>
                    <li>基於法律執行或其他政府機關之要求。</li>
                </ol>
            </li>
            <li>您同意保障和維護本公司及任何其他第三者的利益，如您因違反前條任何一款規定，而使本公司或任何其他第三者發生損害，您同意承擔所造成損害之賠償責任。</li>
        </ol>

        <h3>法律爭議、準據法與管轄</h3>
        <ol>
            <li>本使用者條款與免責聲明之訂立、執行、及解釋，您同意均應適用中華民國法律。</li>
            <li>使用者使用 akaSwap 服務相關之任何爭議，您同意以臺灣臺北地方法院作為第一審管轄法院。</li>
        </ol>
        </>}
        {getItem('language') === 'en' && <>
        <h2>Terms of Use and Disclaimer</h2>

        <h3>Principle</h3>
        <ol>
            <li>akaSwap was incorporated to develop a transparent trade platform in order to help digital artists sell their creations more stably and safely, and to help collectors access more creations more effectively.</li>
            <li>Please carefully read and understand the “Terms of Use and Disclaimer” before using akaSwap and other services. Please feel free to contact us with any questions you may have. It is deemed that you have fully read, understood, and agreed to the “Terms of Use and Disclaimer” once you have started using the services. Also, you have agreed to comply with the following clauses and are willing to assume the relevant obligations and responsibilities.</li>
            <li>The “Terms of Use and Disclaimer” will be modified or revised at any time by the company. You are advised to read and check your rights and obligations carefully before accessing the website. The company reserves the right to modify or revise the “Terms of U and Disclaimer.” It is deemed that you have accepted the modified or revised “Terms of Use and Disclaimer” once you have started using the services thereafter.</li>
            <li>If the “Terms of Use and Disclaimer” conflicts with the special clauses announced by akaSwap, the additional terms or special clauses shall prevail. The invalidity of any clause of the “Terms of Use and Disclaimer” does not affect the validity of the remaining clauses.</li>
            <li>The specific service content of akaSwap depends on the actual situation that is to be interpreted by the company.</li>
            <li>Users agree that the company has the right to change or terminate akaSwap services partially or entirely at any time; also, users may stop receiving akaSwap services at any time.</li>
            <li>Underage users may not use akaSwap services without the consent of the legal guardians. Therefore, underage users shall read the “Terms of Use and Disclaimer” with the guardians together. The guardians who permit the underage users to use akaSwap services must comply with the “Terms of Use and Disclaimer” and will be held responsible for all your children in all activities of these services provided.</li>
        </ol>

        <h3>User behaviors</h3>
        <ol>
            <li>
                Users must comply with the following principles when using the website services:
                <ol>
                    <li>Comply with the law, regulations, and orders of the Republic of China.</li>
                    <li>Comply with the “Terms of Use and Disclaimer.”</li>
                    <li>Comply with all network protocols, regulations, and programs related to network services.</li>
                    <li>Do not use the website services for any illegal purpose.</li>
                    <li>Do not implement any equipment, software, procedures, or other methods to interfere or attempt to interfere with the website operation.</li>
                    <li>Do not implement any function that may have the platform damaged, disabled, overloaded, or the service jeopardized.</li>
                    <li>Do not intrude, forcefully intrude, access, and use, or, attempt to intrude, access, and use the website server, and do not try to access to any data zone without authorization, including but not limited to modifying, deleting, or collecting any information of others, etc.</li>
                    <li>Do not constrain or stop other users from using and enjoying the website services.</li>
                </ol>
            </li>
            <li>
            The artists who use akaSwap are hereby authorizing the company the following matters for the purpose of having akaSwap services operated effectively:
                <ol>
                    <li>Manage, reproduce, distribute, disseminate and use the contents of the users.</li>
                    <li>Modify the contents of the users and create derivative works with the contents of the users, such as formatting or translating the contents of the users.</li>
                </ol>
            </li>
        </ol>

        <h3>Suppression of Illegal Act and Disclaimer</h3>
        <ol>
            <li>We hereby state again that akaSwap is a trading platform specifically for artists and collectors only. We do not provide any of the following services and will definitely not engage in any illegal conduct, such as money laundering and terrorism financing activities:
                <ol>
                    <li>Exchange of virtual currency and New Taiwan dollar, foreign currency, and currencies issued in Mainland China, Hong Kong, and Macau;</li>
                    <li>Exchange of virtual currencies;</li>
                    <li>Transfer of virtual currency;</li>
                    <li>Custody and management of virtual currency, or providing related management tools;</li>
                    <li>Participating in and providing financial services related to the issuance or sale of virtual currencies;</li>
                    <li>User registration function;</li>
                </ol>
            </li>
            <li>Users must have a legitimate e-wallet and sufficient virtual currency Tezos to conduct transactions and receive services on akaSwap. In addition, all transactions conducted on akaSwap will be recorded and disclosed on the Tezos blockchain for a safe and transparent transaction.</li>
            <li>Therefore, if users have improperly used this website for any illegal purpose (including but not limited to money laundering, illegal gambling, terrorism financing activities, malicious hacking operations, etc.), the users will be held fully responsible without holding akaSwap platform or the company accountable whatsoever.</li>
        </ol>

        <h3>Intellectual property rights and user minting behavior</h3>
        <ol>
            <li>The service contents provided by this website (including but not limited to: text, photos, graphics, images, charts, sounds, FLASH animations, videos, audios, trademarks, etc.) are legally owned by akaSwap or other related rightful owners, such as artists, and protected by intellectual property law, such as copyright law and trademark law.</li>
            <li>The website and the website contents may not be modified, duplicated, reproduced, reprinted, publicly broadcast, modified, distributed, published, publicly presented, or used for any illegal purpose without the written consent of this website or other relevant rightful owners in advance.</li>
            <li>
            Users agree to comply with the following terms when users start using akaSwap platform and before minting or swapping:
                <ol>
                    <li>Users will not mint or swap works without the consent or authorization of the copyright owner.</li>
                    <li>Users will not mint or swap the works that are known to infringe copyright or plate right.</li>
                    <li>Users will not mint or swap derivative works without the consent or authorization of the authors.</li>
                    <li>Users will not personate or use misleading usernames.</li>
                    <li>Users will not infringe the copyright, plate right, trademark, privacy, or other rights of a third party in any way.</li>
                    <li>Users, except for in a special circumstance, will not mint or swap the works on akaSwap that have been minted in other blockchains or platforms; vice versa, users will not mint or swap the works that have been minted or swapped on akaSwap in other blockchains or platforms.</li>
                    <li>Users will not repeatedly mint the same or similar works.</li>
                    <li>
                    akaSwap respects the creative process and artistic freedom. However, except for the aforementioned items, the works minted or swapped by users must not contain the following contents:
                        <ol>
                            <li>Any content that violates the law or infringes the rights of others (including copyright, plat right, trademark, privacy, or other rights);</li>
                            <li>Any content that involves pornography, obscenity, or disgust;</li>
                            <li>Any content that involves discriminatory or hatred remarks.</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <li>Users who have violated the aforementioned specifications will be held fully responsible for the consequence without holding akaSwap and the company accountable whatsoever.</li>
            <li>akaSwap may determine discretionally whether to have the artists’ works that are in violation of the “Terms of Use and Disclaimer” rejected or deleted.</li>
        </ol>

        <h3>Suspension and Compensation</h3>
        <ol>
            <li>
            The company has the right to immediately terminate or prohibit users from using akaSwap services when any of the following conducts have been committed by the users with compensation for damages charged and collected from the users lawfully:
                <ol>
                    <li>Violate any provision illustrated in the “User Behaviors” section.</li>
                    <li>Violate any provision illustrated in the “Anti-money Laundering and Disclaimer” section.</li>
                    <li>Violate any provision illustrated in the “Intellectual property rights” section.</li>
                    <li>The company determines that the website has been improperly used by the users.</li>
                    <li>The company determines that the users are with a risk of violating law and regulations.</li>
                    <li>Based on the requests of law enforcement or other government agencies.</li>
                </ol>
            </li>
            <li>Users agree to protect and maintain the interests of the company and any third party. Users agree to be held responsible for compensating damages that occurred to the company or any third party as a result of users’ violating any provision in the preceding paragraph.</li>
        </ol>

        <h3>Legal disputes, applicable law and jurisdiction</h3>
        <ol>
            <li>Users agree to have the “Terms of Use and Disclaimer” formulated, implemented, and interpreted in accordance with the law of the Republic of China.</li>
            <li>Users agree to have Taipei District Court of Taiwan as the court of the first instance with jurisdiction to resolve all disputes related to akaSwap services.</li>
        </ol>
        </>

        }
    </>
    )
}

