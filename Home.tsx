import ReactDOM from 'react-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTwitter, faDiscord} from "@fortawesome/free-brands-svg-icons";
import {faBars} from '@fortawesome/free-solid-svg-icons'
import homeLogo from './assets/home_logo.png'
import presaleImg from './assets/hero.gif'
import c1Img from './assets/c1.png'
import c2Img from './assets/c2.png'
import c3Img from './assets/c3.png'
import c4Img from './assets/c4.png'
import c5Img from './assets/c5.png'
import c6Img from './assets/c6.png'
import c7Img from './assets/c7.png'
import c8Img from './assets/c8.png'
import c1 from './assets/cl1.png'
import c2 from './assets/cr1.png'
import c3 from './assets/cr2.png'
import c4 from './assets/roadmap.png'
import React, {useEffect, useState, useRef, useMemo} from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import {Button, CircularProgress, Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import * as anchor from "@project-serum/anchor";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import {WalletDialogButton} from "@solana/wallet-adapter-material-ui";

import {
    CandyMachine,
    awaitTransactionSignatureConfirmation,
    getCandyMachineState,
    mintOneToken,
    //shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
    candyMachineId: anchor.web3.PublicKey;
    config: anchor.web3.PublicKey;
    connection: anchor.web3.Connection;
    startDate: number;
    treasury: anchor.web3.PublicKey;
    txTimeout: number;
}

const Home = (props: HomeProps) => {

    const [showMobileMenu, setShowMobileMenu] = React.useState(false)
    const [showFullWebsite] = React.useState(true)
    const homeRef = useRef<null | HTMLDivElement>(null);
    const presaleRef = useRef<null | HTMLDivElement>(null);
    const rarityRef = useRef<null | HTMLDivElement>(null);
    const chihuauaRef = useRef<null | HTMLDivElement>(null);
    const roadmapRef = useRef<null | HTMLDivElement>(null);

    const MobileMenuClick = () => {
        setShowMobileMenu(!showMobileMenu);
    }
    const MenuClick = (section: string) => {
        switch (section) {
            case 'home':
                if (homeRef !== null && homeRef.current !== undefined && homeRef.current !== null) {
                    homeRef.current.scrollIntoView({behavior: 'smooth'});
                }
                break;
            case 'presale':
                if (presaleRef !== null && presaleRef.current !== undefined && presaleRef.current !== null) {
                    presaleRef.current.scrollIntoView({behavior: 'smooth'});
                }
                break;
            case 'rarity':
                if (rarityRef !== null && rarityRef.current !== undefined && rarityRef.current !== null) {
                    rarityRef.current.scrollIntoView({behavior: 'smooth'});
                }
                break;
            case 'chihuaua':
                if (chihuauaRef !== null && chihuauaRef.current !== undefined && chihuauaRef.current !== null) {
                    chihuauaRef.current.scrollIntoView({behavior: 'smooth'});
                }
                break;
            case 'roadmap':
                if (roadmapRef !== null && roadmapRef.current !== undefined && roadmapRef.current !== null) {
                    roadmapRef.current.scrollIntoView({behavior: 'smooth'});
                }
                break;
        }
    }
    const DiscordClick = () => {
        window.open('https://discord.gg/cQMHepBqmc');
    }
    const TwitterClick = () => {
        window.open('https://twitter.com/ChihuahuaSol');
    }

    const [balance, setBalance] = useState<number>();
    const [isActive, setIsActive] = useState(false); // true when countdown completes
    const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const [startDate, setStartDate] = useState(new Date(props.startDate));

    const wallet = useWallet();
    const [candyMachine, setCandyMachine] = useState<CandyMachine>();

    const onMint = async () => {
        try {
            setIsMinting(true);
            if (wallet.connected && candyMachine?.program && wallet.publicKey) {
                const mintTxId = await mintOneToken(
                    candyMachine,
                    props.config,
                    wallet.publicKey,
                    props.treasury
                );

                const status = await awaitTransactionSignatureConfirmation(
                    mintTxId,
                    props.txTimeout,
                    props.connection,
                    "singleGossip",
                    false
                );

                if (!status?.err) {
                    setAlertState({
                        open: true,
                        message: "Congratulations! Mint succeeded!",
                        severity: "success",
                    });
                } else {
                    setAlertState({
                        open: true,
                        message: "Mint failed! Please try again!",
                        severity: "error",
                    });
                }
            }
        } catch (error: any) {
            // TODO: blech:
            let message = error.msg || "Minting failed! Please try again!";
            if (!error.msg) {
                if (error.message.indexOf("0x138")) {
                } else if (error.message.indexOf("0x137")) {
                    message = `SOLD OUT!`;
                } else if (error.message.indexOf("0x135")) {
                    message = `Insufficient funds to mint. Please fund your wallet.`;
                }
            } else {
                if (error.code === 311) {
                    message = `SOLD OUT!`;
                    setIsSoldOut(true);
                } else if (error.code === 312) {
                    message = `Minting period hasn't started yet.`;
                }
            }

            setAlertState({
                open: true,
                message,
                severity: "error",
            });
        } finally {
            if (wallet?.publicKey) {
                const balance = await props.connection.getBalance(wallet?.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }
            setIsMinting(false);
        }
    };

    useEffect(() => {
        (async () => {
            if (wallet?.publicKey) {
                const balance = await props.connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }
        })();
    }, [wallet, props.connection]);

    useEffect(() => {
        (async () => {
            if (
                !wallet ||
                !wallet.publicKey ||
                !wallet.signAllTransactions ||
                !wallet.signTransaction
            ) {
                return;
            }

            const anchorWallet = {
                publicKey: wallet.publicKey,
                signAllTransactions: wallet.signAllTransactions,
                signTransaction: wallet.signTransaction,
            } as anchor.Wallet;

            const {candyMachine, goLiveDate, itemsRemaining} =
                await getCandyMachineState(
                    anchorWallet,
                    props.candyMachineId,
                    props.connection
                );

            setIsSoldOut(itemsRemaining === 0);
            // setStartDate(goLiveDate);
            setCandyMachine(candyMachine);
        })();
    }, [wallet, props.candyMachineId, props.connection]);

    return (
        <main>
            <MintContainer>
                {showMobileMenu ?
                    <div className={'mobile-menu primary-bg'}>
                        {showFullWebsite ?
                            <div>
                                <div onClick={() => {
                                    MenuClick('home')
                                }} className={'mobile-menu-button'}>
                                    Home
                                </div>
                                <div onClick={() => {
                                    MenuClick('presale')
                                }} className={'mobile-menu-button'}>
                                    About Us
                                </div>
                                <div onClick={() => {
                                    MenuClick('rarity')
                                }} className={'mobile-menu-button'}>
                                    Rarity
                                </div>
                                <div onClick={() => {
                                    MenuClick('chihuaua')
                                }} className={'mobile-menu-button'}>
                                    Chihuahua
                                </div>
                                <div onClick={() => {
                                    MenuClick('roadmap')
                                }} className={'mobile-menu-button'}>
                                    Road map
                                </div>
                            </div>
                            :
                            null}
                        <div className={'icon-container'}>
                            <div onClick={DiscordClick} className={'icon-button'}>
                                <FontAwesomeIcon icon={faDiscord}/>
                            </div>
                            <div onClick={TwitterClick} className={'icon-button'}>
                                <FontAwesomeIcon icon={faTwitter}/>
                            </div>
                            </div>
                    </div>
                    :
                    null}
                <div className={'container-top-menu primary-bg'}>
                    <div className={'container-content desktop-menu'}>
                    
                        <div onClick={DiscordClick} className={'icon-button'}>
                            <img alt="chihuaua" src={c1}/>
                        </div>
                        <div onClick={TwitterClick} className={'icon-button'}>
                            {/*<FontAwesomeIcon icon={faTwitter}/>*/}
                        </div>
                        {showFullWebsite ?
                            <div className={'top-menu-buttons-container'}>
                                <div onClick={() => {
                                    MenuClick('home')
                                }} className={'top-menu-button'}>
                                    Home
                                </div>
                                <div onClick={() => {
                                    MenuClick('presale')
                                }} className={'top-menu-button'}>
                                    About us
                                </div>
                                <div onClick={() => {
                                    MenuClick('rarity')
                                }} className={'top-menu-button'}>
                                    Rarity
                                </div>
                                <div onClick={() => {
                                    MenuClick('chihuaua')
                                }} className={'top-menu-button'}>
                                    Chihuahua
                                </div>
                                <div onClick={() => {
                                    MenuClick('roadmap')
                                }} className={'top-menu-button'}>
                                    Road Map
                                </div>
                            </div>
                            :
                            null}
                    </div>
                    <div className={'mobile-menu-bar'}>
                        <br></br>
                        <img alt="ChihuahuaSol logo" className={'start-logo'} src={homeLogo}/>
                        <div className={'icon-button'} onClick={MobileMenuClick}>
                            <FontAwesomeIcon icon={faBars}/>
                        </div>
                    </div>
                </div>
                <div ref={homeRef} className={'container-start'}>
                    <div className={'container-content start-content'}>
                    <br></br>
                        <img alt="ChihuahuaSol logo" className={'start-logo'} src={homeLogo}/><br/>
                        {!wallet.connected ? (
                            <ConnectButton className={'custom-mint-button'}>Connect Wallet</ConnectButton>
                        ) : (
                            <MintButton
                                className={'custom-mint-button'}
                                disabled={isSoldOut || isMinting || !isActive}
                                onClick={onMint}
                                variant="contained"
                            >
                                {isSoldOut ? (
                                    "SOLD OUT"
                                ) : isActive ? (
                                    isMinting ? (
                                        <CircularProgress/>
                                    ) : (
                                        "MINT"
                                    )
                                ) : (
                                    <Countdown
                                        date={startDate.getTime() * 1000}
                                        onMount={({completed}) => completed && setIsActive(true)}
                                        onComplete={() => setIsActive(true)}
                                        renderer={renderCounter}
                                    />
                                )}
                            </MintButton>
                        )}
                        <div className={'price-label'}>Mint price: 1 SOL</div>
                    </div>
                </div>
                {showFullWebsite ?
                    <div>
                        <div ref={presaleRef} className={'container-main dark-purple-bg'}>
                            <div className={'container-content presale-container-content-bottom-padding'}>
                                <div className={'content-top'}>
                                    <div className={'container-title-decoration presale-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'container-title presale-container-title'}>
                                        About Us
                                    </div>
                                    <div className={'container-title-decoration presale-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'clear-float'}/>
                                </div>
                                <div
                                    className={'container-content-panel presale-container-content-panel light-purple-bg'}>
                                    <div className={'presale-img'}>
                                        <img alt="presale" src={presaleImg}/><br/>
                                    </div>
                                    <div className={'presale-text'}>
                                        <div className={'presale-text-title'}>WHAT IS ChihuahuaSol?</div>
                                        <div className={'presale-text-content'}>
                                            ChihuahuaSol is a Solana NFT that will bring values to the NFT holders via free airdrop token, royality sharing and DAO treasury fund.<br />
                                            There is a supply of 1010 ChihuahuaSols. Current minting price is 1 SOL per NFT.<br /><br />
                                            Minting is live and these cute and lovely Chihuahua are looking for a home.

                                        </div>
                                    </div>
                                    <div className={'clear-float'}/>
                                </div>
                            </div>
                        </div>
                        <div ref={rarityRef} className={'container-main mesh-bg'}>
                            <div className={'container-content rarity-container-content-bottom-padding'}>
                                <div className={'content-top'}>
                                    <div className={'container-title-decoration rarity-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'container-title rarity-container-title'}>
                                        Rarity
                                    </div>
                                    <div className={'container-title-decoration rarity-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'clear-float'}/>
                                </div>
                                <div className={'container-content-panel'}>
                                    <div className={'chihuaua-label-container'}>
                                        <img alt="Chihuahua Rarity" src={c2} height={2650} />
                                        <img alt="Chihuahua Rarity" src={c3} height={2650} />
                                    </div>
                                    <br /><br /><br /><br /><br /><br />
                                </div>
                            </div>
                        </div>
                        <div ref={chihuauaRef} className={'container-main dark-purple-bg'}>
                            <div className={'container-content cards-container-content-bottom-padding'}>
                                <div className={'content-top'}>
                                    <div className={'container-title-decoration cards-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'container-title cards-container-title'}>
                                        Chihuahua
                                    </div>
                                    <div className={'container-title-decoration cards-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'clear-float'}/>
                                </div>
                                <div className={'container-content-panel cards-container-content-panel'}>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c1Img}/>
                                    </div>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c2Img}/>
                                    </div>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c3Img}/>
                                    </div>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c4Img}/>
                                    </div>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c5Img}/>
                                    </div>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c6Img}/>
                                    </div>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c7Img}/>
                                    </div>
                                    <div className={'chihuaua-card'}>
                                        <img alt="chihuaua" src={c8Img}/>
                                    </div>
                                    <div className={'clear-float'}/>
                                </div>
                            </div>
                        </div>
                        <div ref={roadmapRef} className={'container-main mesh-bg'}>
                        <div className={'container-content rarity-container-content-bottom-padding'}>
                                <div className={'content-top'}>
                                    <div className={'container-title-decoration rarity-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'container-title rarity-container-title'}>
                                        Roadmap
                                    </div>
                                    <div className={'container-title-decoration rarity-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'clear-float'}/>
                                </div>
                                <div className={'container-content-panel'}>
                                    <div className={'chihuaua-label-container'}>
                                        <img alt="Chihuahua Rarity" src={c4} height={1800} />
                                        
                                    </div>
                                    <br /><br /><br /><br /><br /><br />
                                </div>
                            </div>
                        </div>
                        <div className={'container-main dark-purple-bg'}>
                            <div className={'container-content contact-container-content-bottom-padding'}>
                                <div className={'content-top'}>
                                    <div className={'container-title-decoration contact-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'container-title contact-container-title'}>
                                        Don't miss out
                                    </div>
                                    <div className={'container-title-decoration contact-title-decoration'}>
                                        <hr/>
                                    </div>
                                    <div className={'clear-float'}/>
                                </div>
                                <div className={'container-content-panel contact-container-content-panel'}>
                                    <div className={'contact-buttons-holder'}>
                                        <div onClick={DiscordClick} className={'icon-button'}>
                                            <FontAwesomeIcon icon={faDiscord}/>
                                        </div>
                                        <div onClick={TwitterClick} className={'icon-button'}>
                                            <FontAwesomeIcon icon={faTwitter}/>
                                        </div>
                                        <div className={'clear-float'}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'container-main primary-bg footer-container-main'}>
                            <br></br>
                            <br></br>
                            <img alt="ChihuahuaSol logo" className={'start-logo'} src={homeLogo}/>
                            <div className={'footer-text'}>
                                Copyright © 2021 ChihuahuaSol
                            </div>
                        </div>
                    </div>
                    :
                    null}
            </MintContainer>

            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({...alertState, open: false})}
            >
                <Alert
                    onClose={() => setAlertState({...alertState, open: false})}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </main>
    );
};

interface AlertState {
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({days, hours, minutes, seconds, completed}: any) => {
    return (
        <CounterText>
            {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
        </CounterText>
    );
};

export default Home;
