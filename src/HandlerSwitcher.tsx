import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import registerRootHandler from './events/rootHandler';
import './index.css';

import { default as CenturionView } from './handlers/centurion';
import { default as SpotifyView } from './handlers/spotify';
import { default as DefaultView } from './handlers/default';
import StageEffectsView from './handlers/stage-effects';
import TimeTrailRaceView from './handlers/time-trail-race';
import PosterGewisView from './handlers/poster/gewis';
import PosterHubbleView from './handlers/poster/hubble';
import RoomResponsibleLegacyView from './handlers/room-responsible-legacy';

export enum Handlers {
  SPOTIFY = 'CurrentlyPlayingTrackHandler',
  CENTURION = 'CenturionScreenHandler',
  GEWIS_POSTER = 'GewisPosterScreenHandler',
  HUBBLE_POSTER = 'HubblePosterScreenHandler',
  STAGE_EFFECTS = 'StageEffectsHandler',
  TIME_TRAIL_RACE = 'TimeTrailRaceScreenHandler',
  ROOM_RESPONSIBLE_LEGACY = 'RoomResponsibleLegacyHandler',
}

interface Props {
  socket: Socket;
}

export default function HandlerSwitcher({ socket }: Props) {
  const [currentHandler, setCurrentHandler] = useState<Handlers | null>(null);

  useEffect(() => {
    registerRootHandler(setCurrentHandler);
  }, []);

  switch (currentHandler) {
    case Handlers.CENTURION:
      return <CenturionView socket={socket} />;
    case Handlers.SPOTIFY:
      return <SpotifyView socket={socket} />;
    case Handlers.GEWIS_POSTER:
      return <PosterGewisView />;
    case Handlers.HUBBLE_POSTER:
      return <PosterHubbleView />;
    case Handlers.STAGE_EFFECTS:
      return <StageEffectsView socket={socket} />;
    case Handlers.TIME_TRAIL_RACE:
      return <TimeTrailRaceView socket={socket} />;
    case Handlers.ROOM_RESPONSIBLE_LEGACY:
      return <RoomResponsibleLegacyView />;
    default:
      return <DefaultView />;
  }
}
