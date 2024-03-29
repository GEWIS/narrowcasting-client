import { useState } from 'react';
import React from 'react';
import { Socket } from 'socket.io-client';
import BlurredImage from '../stage-effects/components/backgrounds/BlurredImage';

interface Props {
  socket: Socket;
}

interface TrackChangeEvent {
  title: string;
  artists: string[];
  cover?: string;
}

export default function SpotifyView({ socket }: Props) {
  const [albumCover, setAlbumCover] = useState<string>('https://placekitten.com/g/200/200');
  const [artist, setArtists] = useState<string>('Roy Kakkenberg, Gijs de Man & Samuel Oosterholt');
  const [song, setSong] = useState<string>('Wie dit leest, trekt een bak!');

  React.useEffect(() => {
    socket.on('change_track', (event: any[]) => {
      const trackChangeEvent = event[0] as TrackChangeEvent[];
      setArtists(trackChangeEvent[0].artists.join(', '));
      setSong(trackChangeEvent[0].title);
      setAlbumCover(trackChangeEvent[0].cover);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <div className="relative">
      <BlurredImage cover={albumCover} />
      <div className="h-screen flex items-center justify-center relative">
        <img className="h-1/2 mr-6" src={albumCover} />
        <div className="w-fit max-w-4xl flex flex-col justify-center font-raleway">
          <p
            className="text-black text-6xl p-4 font-bold shadow-gray-200 drop-shadow-xl"
            style={{ filter: 'drop-shadow(0 0 5px rgb(255 255 255 /0.7))' }}
          >
            {artist}
          </p>
          <p
            className="text-white text-6xl p-4 font-semibold font-raleway"
            style={{ filter: 'drop-shadow(0 0 5px rgb(0 0 0 /0.4))' }}
          >
            {song}
          </p>
        </div>
      </div>
    </div>
  );
}
