import React from 'react';
import { useAuth } from 'react-oidc-context';
import { ShieldCheck, ChevronRight, ArrowDown, Lock, User, LayoutGrid, ChevronDown } from 'lucide-react';
import { LogoPng as Logo, MobileIdIcon, GoogleIcon, VneidIcon as VNeIDIcon } from '../../assets/images';
import UsaFlag from '../../assets/images/icons--usa-flag.svg';
import { clearBrowserSession } from '../../utils/browserSession';

const Login = () => {
    const auth = useAuth();

    const loginWithMobileID = async () => {
        await clearBrowserSession();
        await auth.signinRedirect({
            extraQueryParams: { prompt: 'login' },
        });
    };

    const loginWithGoogle = async () => {
        await clearBrowserSession();
        await auth.signinRedirect({
            extraQueryParams: {
                kc_idp_hint: 'google',
                prompt: 'login',
            },
        });
    };

    const loginWithVNeID = async () => {
        await clearBrowserSession();
        await auth.signinRedirect({
            extraQueryParams: {
                kc_idp_hint: 'vneid',
                prompt: 'login',
            },
        });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-surface-secondary font-sans">
            <div className="pointer-events-none absolute right-[-10%] top-1/2 -z-10 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] lg:h-[800px] lg:w-[800px] -translate-y-1/2 rounded-full bg-palette-primary-100/40 blur-[120px]" />

            {/* Header */}
            <header className="absolute top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-5 lg:py-6 z-10">
                <img
                    src={Logo}
                    alt="CheckID BioSense"
                    className="h-10 object-contain"
                    fetchPriority="high"
                    loading="eager"
                />

                {/* Language Selector */}
                <button type="button" className="flex items-center gap-2 rounded-md border border-border-primary bg-surface-primary px-3 py-1.5 shadow-sm transition-colors hover:bg-surface-secondary">
                    <img src={UsaFlag} alt="EN" className="h-5 w-5 rounded-sm object-cover" />
                    <ChevronDown className="h-4 w-4 text-text-tertiary" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-8 lg:pt-16 lg:pb-0">
                <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-16 xl:gap-32">

                    {/* Left Panel: Login Card */}
                    <div className="z-10 w-full max-w-[616px] shrink-0 rounded-[20px] border border-border-primary bg-surface-primary p-6 sm:p-8 lg:p-12 shadow-sm">

                        <div className="mb-6 lg:mb-10 flex flex-col items-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-dimBrandLv1 text-brand-primary">
                                <ShieldCheck className="h-8 w-8 stroke-[1.5]" />
                            </div>
                            <h1 className="mb-1 text-3xl font-bold text-text-primary">BackOffice Login</h1>
                            <p className="text-base font-medium text-text-tertiary">Enterprise Management System</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={loginWithMobileID}
                                className="group flex h-[52px] w-full items-center justify-between rounded-lg border border-border-primary bg-surface-primary px-4 transition-all hover:border-palette-grey-300 hover:bg-surface-secondary"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={MobileIdIcon} alt="MobileID" className="w-6 h-6 object-contain" />
                                    <span className="text-[15px] font-medium text-palette-grey-700">Login with Mobile-ID</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-text-tertiary transition-colors group-hover:text-text-secondary" />
                            </button>

                            <button
                                onClick={loginWithGoogle}
                                className="group flex h-[52px] w-full items-center justify-between rounded-lg border border-border-primary bg-surface-primary px-4 transition-all hover:border-palette-grey-300 hover:bg-surface-secondary"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={GoogleIcon} alt="Google" className="w-6 h-6 object-contain" />
                                    <span className="text-[15px] font-medium text-palette-grey-700">Login with Google</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-text-tertiary transition-colors group-hover:text-text-secondary" />
                            </button>

                            <button
                                onClick={loginWithVNeID}
                                className="group flex h-[52px] w-full items-center justify-between rounded-lg border border-border-primary bg-surface-primary px-4 opacity-80 transition-all hover:border-palette-grey-300 hover:bg-surface-secondary"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={VNeIDIcon} alt="VNeID" className="w-6 h-6 object-contain" />
                                    <span className="text-[15px] font-medium text-palette-grey-700">Login with VNeID</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-text-tertiary transition-colors group-hover:text-text-secondary" />
                            </button>
                        </div>
                    </div>

                    <div className="z-10 hidden w-full max-w-[500px] flex-col items-center pt-4 lg:flex">
                        <h2 className="mb-8 text-lg font-bold text-text-primary">Authentication Flow</h2>

                        <div className="flex w-full max-w-[420px] flex-col items-center">
                            <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-surface-tertiary bg-surface-primary px-5 shadow-sm">
                                <Lock className="h-5 w-5 stroke-[1.5] text-text-secondary" />
                                <span className="text-base font-medium text-palette-grey-700">SSO Login</span>
                            </div>

                            <ArrowDown className="my-2 h-4 w-4 text-text-tertiary" />

                            <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-surface-tertiary bg-surface-primary px-5 shadow-sm">
                                <User className="h-5 w-5 stroke-[1.5] text-text-secondary" />
                                <span className="text-base font-medium text-palette-grey-700">Check account in Administrator table</span>
                            </div>

                            <ArrowDown className="my-2 h-4 w-4 text-text-tertiary" />

                            <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-surface-tertiary bg-surface-primary px-5 shadow-sm">
                                <ShieldCheck className="h-5 w-5 stroke-[1.5] text-text-secondary" />
                                <span className="text-base font-medium text-palette-grey-700">Check permissions</span>
                            </div>

                            <ArrowDown className="my-2 h-4 w-4 text-text-tertiary" />

                            <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-surface-tertiary bg-surface-primary px-5 shadow-sm">
                                <LayoutGrid className="h-5 w-5 stroke-[1.5] text-text-secondary" />
                                <span className="text-base font-medium text-palette-grey-700">Set up screen & functions by access rights</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Login;