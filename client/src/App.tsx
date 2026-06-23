import { Box, ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameRoom } from './Components/Contexts/GameRoomContext';
import { LocalGameDataProvider } from './Components/Contexts/LocalGameContext';
import { useScreenSelection } from './Components/Contexts/useScreenSelection';
import HomeScreen from './Components/Home/HomeScreen';
import Lobby from './Components/Lobby/Lobby';
import Play from './Components/Play/Play';
import EndScreen from './Components/Results/EndScreen';
import MidGameResults from './Components/Results/MidGameResults';
import CreateRoom from './Components/Room/CreateRoom';
import JoinRoom from './Components/Room/JoinRoom';
import { ProgressState, RoundStage } from './data/DataTypes';
import { initGlobalData } from './data/data';
import { socketServerURL } from './Components/Contexts/ConnectionContext';
import AboutScreen from './Components/Home/AboutScreen';
import { useConfig } from './Components/Contexts/Config';
import { initTheme } from './Theme/Theme';
import React from 'react';
import { i18n } from 'i18next';

async function loadData(socketServerURL: string, language: string | undefined, i18n: i18n) {
   // TODO check if correctly async no time now (move the try block from main to here etc.)
   // TODO also load this in the language context as it may use different tranlastions
   await initGlobalData(socketServerURL, language, i18n);
}

function App() {
   const config = useConfig();
   const theme = React.useMemo(() => initTheme(config), [config]);
   const { currentScreen } = useScreenSelection(); // Get the current screen from context
   const { gameRoomState } = useGameRoom();

   const { i18n } = useTranslation();
   useEffect(() => {
      loadData(socketServerURL, i18n.resolvedLanguage, i18n);
      document.title = config.app_name;
   }, []);

   // Function to switch between screens
   const renderScreen = () => {
      let screenToSwitch = currentScreen;
      // override
      // TODO get rid of this override and make a smarter way to handle this with the networking now
      if (gameRoomState) {
         console.log('overriding screen due to networking');
         switch (gameRoomState.gameState) {
            case ProgressState.NotStarted:
               screenToSwitch = 'lobby';
               break;
            case ProgressState.InProgress:
               // show results only after voting finishes
               if (gameRoomState.round.stage === RoundStage.Voting &&
                  gameRoomState.round.stageProgress === ProgressState.Finished) {
                  screenToSwitch = 'results';
               }
               else screenToSwitch = 'play';
               break;
            case ProgressState.Finished:
               screenToSwitch = 'end';
               break;
            default:
               break;
         }
      }
      switch (screenToSwitch) {
         case 'home':
            return <HomeScreen />;
         case 'about':
            return <AboutScreen />;
         case 'join':
            return <JoinRoom />;
         case 'create':
            return <CreateRoom />;
         case 'lobby':
            return <Lobby />
         case 'play':
            return <LocalGameDataProvider><Play /></LocalGameDataProvider>;
         case 'results':
            return <LocalGameDataProvider><MidGameResults /></LocalGameDataProvider>;;
         case 'end':
            return <LocalGameDataProvider><EndScreen /></LocalGameDataProvider>;
         default:
            return <HomeScreen />;
      }
   };

   // home screen    -- for info before connecting to the socket.io server
   // room screen    -- (join/create) to configure a room, username and join
   // play screen    -- to acutally play the game (can use a parametr with id of the room to rejoin on refresh)
   return (
      <ChakraProvider theme={theme}>
         <Box
            className="app"
            h='calc(100vh)'
            w='calc(100vw)'
            bg="primary.100"
         >
            {renderScreen()}
         </Box>
      </ChakraProvider>
   )
}

export default App;
