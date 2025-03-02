import { useEffect, useState } from "react"
import Header from "../components/Header"
import { useLocation } from "react-router-dom";
import serviceProxy from "../services/serviceProxy";
import { jwtDecode } from 'jwt-decode'
import Constants from "../constants";

export const SectionTxt = (props) => {
    const {
        title,
        description
    } = props
    return (
        <div className="sec_box">
            <div className="sec_txt">{title}</div>
            <div className="sub_txt">{description}</div>
        </div>
    )
}

export const PrivacyPolicy = () => {
    const accountId = () => {
        const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
        return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
    }

    const [flowData, setFlowData] = useState()


    useEffect(() => {
        const fetchFlow = () => {
            const account_id = accountId()
            const detailsQuery = {
                account_id: { $eq: account_id },
                "app_id": {
                    "$eq": "-2"
                },
                "page_type": {
                    "$eq": "client"
                }
            }

            serviceProxy.business.find(Constants.Application, "workflow_status", "view", detailsQuery, [], 1, 10, [])
                .then((response) => {
                    if (response.records.length > 0) {
                        setFlowData((set) => {
                            response.records.forEach(element => {
                                console.log(JSON.parse(element.content));
                                element.content = JSON.parse(element.content)
                            });
                            return response.records
                        })
                        // setFlowData(response.records)
                    }

                }).catch((error) => {
                    console.log(error)
                })
        }
        fetchFlow()
    }, [])
    useEffect(() => {
        console.log(flowData);
    })
    return (
        <>
            <Header />
            <div className="cbody" id="invoiceContent">
                <div className="cart_container">
                    <div className="sec_container">
                        <div class="header">
                            <div class="sec_box">
                                <div class="btxt">
                                    Privacy Policy Preview
                                </div>
                            </div>
                        </div>
                        <div class="sec_box">
                            {flowData && flowData.length > 0 && flowData[0].content.map((item) => {
                                return (
                                    <SectionTxt
                                        title={item.title}
                                        description={item.description}
                                    />
                                )
                            })}
                            {/* <div className="sec_box">
                                <div className="sec_txt">Log Files</div>
                                <div className="sub_txt"><span class="highlight preview_website_name">Website Name</span> follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">Cookies and Web Beacons</div>
                                <div className="sub_txt">Like any other website, <span class="highlight preview_website_name">Website Name</span> uses ‘cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">DoubleClick DART Cookie</div>
                                <div className="sub_txt">Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" rel="nofollow noopener noreferrer" target="_blank">https://policies.google.com/technologies/ads</a>.</div>
                                <div className="sub_txt">Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sub_txt">Google</div>
                                <div className="sub_txt"><a rel="nofollow noopener noreferrer" href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a></div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">Privacy Policies</div>
                                <div className="sub_txt">You may consult this list to find the Privacy Policy for each of the advertising partners of <span class="highlight preview_website_name">Website Name</span>.</div>
                                <div className="sub_txt">Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on <span class="highlight preview_website_name">Website Name</span>, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</div>
                                <div className="sub_txt">Note that <span class="highlight preview_website_name">Website Name</span> has no access to or control over these cookies that are used by third-party advertisers.</div>
                            </div>
                            <div className="sec_box">

                                <div className="sec_txt">Third Part Privacy Policies</div>
                                <div className="sub_txt"><span class="highlight preview_website_name">Website Name</span>'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. You may find a complete list of these Privacy Policies and their links here: Privacy Policy Links.</div>
                                <div className="sub_txt">You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites. What Are Cookies?</div>
                            </div>
                            <div className="sec_box">

                                <div className="sec_txt">Children's Information</div>
                                <div className="sub_txt">Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</div>
                                <div className="sub_txt"><span class="highlight preview_website_name">Website Name</span> does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</div>
                            </div>
                            <div className="sec_box">

                                <div className="sec_txt">Online Privacy Policy Only</div>
                                <div className="sub_txt">This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in <span class="highlight preview_website_name">Website Name</span>. This policy is not applicable to any information collected offline or via channels other than this website.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">Consent</div>
                                <div className="sub_txt">By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const TermsAndConditions = () => {

    const accountId = () => {
        const isLoggedIn = serviceProxy.localStorage.getItem('isLoggedIn')
        return isLoggedIn ? jwtDecode(serviceProxy.auth.getJWTToken()).account_id : serviceProxy.localStorage.getItem('account_info').account
    }

    const [flowData, setFlowData] = useState()


    useEffect(() => {
        const fetchFlow = () => {
            const account_id = accountId()
            const detailsQuery = {
                account_id: { $eq: account_id },
                "app_id": {
                    "$eq": "-1"
                },
                "page_type": {
                    "$eq": "client"
                }
            }

            serviceProxy.business.find(Constants.Application, "workflow_status", "view", detailsQuery, [], 1, 10, [])
                .then((response) => {
                    if (response.records.length > 0) {
                        setFlowData((set) => {
                            response.records.forEach(element => {
                                console.log(JSON.parse(element.content));
                                element.content = JSON.parse(element.content)
                            });
                            return response.records
                        })
                        // setFlowData(response.records)
                    }

                }).catch((error) => {
                    console.log(error)
                })
        }
        fetchFlow()
    }, [])
    useEffect(() => {
        console.log(flowData);
    })
    return (
        <>
            <Header />
            <div className="cbody" id="invoiceContent">
                <div className="cart_container">
                    <div className="sec_container">
                        <div className="sec_box">
                            <div className="btxt">Terms and Conditions</div>
                        </div>
                        {flowData && flowData.length > 0 && flowData[0].content.map((item) => {
                            return (
                                <SectionTxt
                                    title={item.title}
                                    description={item.description}
                                />
                            )
                        })}
                        {/* <div className="sec_box">

                            <div className="sec_txt">License</div>

                            <div className="sub_txt">Unless otherwise stated, Basmart and/or its licensors own the intellectual property rights for all material on basmart. All intellectual property rights are reserved. You may access this from basmart for your own personal use subjected to restrictions set in these terms and conditions.</div>

                            <div className="sub_txt">You must not:</div>
                            <ul className="sec_box">
                                <li>Republish material from basmart</li>
                                <li>Sell, rent or sub-license material from basmart</li>
                                <li>Reproduce, duplicate or copy material from basmart</li>
                                <li>Redistribute content from basmart</li>
                            </ul>

                            <div className="sub_txt">This Agreement shall begin on the date hereof. Our Terms and Conditions were created with the help of the <a href="https://www.termsandconditionsgenerator.com/">Free Terms and Conditions Generator</a>.</div>

                            <div className="sub_txt">Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Basmart does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Basmart,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Basmart shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</div>

                            <div className="sub_txt">Basmart reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.</div>
                        </div>

                        <div className="sec_box">
                            <div className="sub_txt">You warrant and represent that:</div>
                            <ul className="sec_box">
                                <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                                <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
                                <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</li>
                                <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
                            </ul>
                            <div className="sub_txt">You hereby grant Basmart a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.</div>
                        </div>
                        <div className="sec_box">

                            <div className="sec_txt">Hyperlinking to our Content</div>
                            <div className="sub_txt">The following organizations may link to our Website without prior written approval:</div>
                            <ul className="sec_box">
                                <li>Government agencies;</li>
                                <li>Search engines;</li>
                                <li>News organizations;</li>
                                <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                                <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
                            </ul>
                            <div className="sub_txt">These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.</div>
                            <div className="sub_txt">We may consider and approve other link requests from the following types of organizations:</div>
                        </div>
                        <div className="sec_box">
                            <ol className="sec_box">
                                <li className="sub_txt">commonly-known consumer and/or business information sources;</li>
                                <li className="sub_txt">dot.com community sites;</li>
                                <li className="sub_txt">associations or other groups representing charities;</li>
                                <li className="sub_txt">online directory distributors;</li>
                                <li className="sub_txt">internet portals;</li>
                                <li className="sub_txt">accounting, law and consulting firms; and</li>
                                <li className="sub_txt">educational institutions and trade associations.</li>
                            </ol>
                        </div>
                        <div className="sec_box">

                            <div className="sub_txt">We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Basmart; and (d) the link is in the context of general resource information.</div>

                            <div className="sub_txt">These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.</div>

                            <div className="sub_txt">If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Basmart. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.</div>

                            <div className="sub_txt">Approved organizations may hyperlink to our Website as follows:</div>
                        </div>
                        <div className="sec_box">
                            <ul className="sec_box">
                                <li className="sub_txt">By use of our corporate name; or</li>
                                <li className="sub_txt">By use of the uniform resource locator being linked to; or</li>
                                <li className="sub_txt">By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party's site.</li>
                            </ul>
                        </div>
                        <div>
                            <div className="sec_box">
                                <div className="sub_txt">No use of Basmart's logo or other artwork will be allowed for linking absent a trademark license agreement.</div>
                                <div className="sec_txt">iFrames</div>
                                <div className="sub_txt">Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">Content Liability</div>
                                <div className="sub_txt">We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">Reservation of Rights</div>
                                <div className="sub_txt">We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">Removal of links from our website</div>
                                <div className="sub_txt">If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</div>
                                <div className="sub_txt">We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</div>
                            </div>
                            <div className="sec_box">
                                <div className="sec_txt">Disclaimer</div>
                                <div className="sub_txt">To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</div>
                                <ul className="sec_box">
                                    <li>limit or exclude our or your liability for death or personal injury;</li>
                                    <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                                    <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                                    <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                                </ul>
                                <div className="sub_txt">The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</div>
                                <div className="sub_txt">As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</div>
                            </div>
                        </div> */}
                    </div>

                </div>
            </div>
        </>
    )
}

export default TermsAndConditions