import { createContext, useContext } from 'react';

// Lets any page open the shared CV modal / chat without prop drilling (provided by SiteLayout).
export const SiteUiContext = createContext({ openCv: () => {}, openChat: () => {}, prefetchChat: () => {} });

export const useSiteUi = () => useContext(SiteUiContext);
