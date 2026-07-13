import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { liveWebSocketUrl } from '../../utils/runtimeConfig';

export type LiveProvider = {
    provider: HocuspocusProvider;
    ydoc: Y.Doc;
};

export function createLiveProvider(pageId: string) : LiveProvider {
    const ydoc = new Y.Doc();


    const provider = new HocuspocusProvider({
        url: liveWebSocketUrl,
        name: pageId,
        document: ydoc,
    });

    return {
        provider, ydoc
    }
}

export function destroyProvider(provider: HocuspocusProvider) {
  provider.destroy();
}