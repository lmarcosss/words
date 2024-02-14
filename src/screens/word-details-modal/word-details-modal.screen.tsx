import React, {useEffect} from 'react';
import {useFavoritesContext} from '@contexts';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {View, Text, ActivityIndicator, ScrollView} from 'react-native';
import {colors} from '@constants';
import {useSoundPlayer, useWordDetails} from '@hooks';
import {RootStackParamListType} from '@types';
import {
  FavoriteButton,
  GoBackButton,
  MeaningsList,
  SoundPlayer,
} from '@components';

type RouteProps = RouteProp<RootStackParamListType, 'WordDetailsModal'>;

import style from './word-details-modal.style';

export function WordDetailsModalScreen() {
  const {setOptions, goBack} = useNavigation();
  const {handleFavoriteWord, favorites} = useFavoritesContext();
  const {params} = useRoute<RouteProps>();
  const {word} = params;
  const {wordDetails, isLoading, isError} = useWordDetails(word);

  const phonetic = wordDetails?.phonetics.reduce(
    (accumulator, currentValue) => {
      if (currentValue?.text) {
        accumulator = {...accumulator, text: currentValue?.text};
      }

      if (currentValue?.audio) {
        accumulator = {...accumulator, audio: currentValue?.audio};
      }

      return accumulator;
    },
    {text: wordDetails?.phonetic},
  );

  const {
    isPlaying,
    currentTime,
    duration,
    onPlayPause,
    isAvailable,
    isLoading: isLoadingAudio,
  } = useSoundPlayer(phonetic?.audio);

  const isLoadingScreen = isLoading || isLoadingAudio;

  useEffect(() => {
    const isFavorite = favorites.includes(word);

    const onFavoriteWord = () => {
      handleFavoriteWord(word);
    };

    setOptions({
      title: 'Word Details',
      headerTitleStyle: style.headerTitle,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => <GoBackButton goBack={goBack} />,

      headerRight: !isError
        ? () => (
            <FavoriteButton
              isFavorite={isFavorite}
              onFavoriteWord={onFavoriteWord}
            />
          )
        : undefined,
    } as NativeStackNavigationOptions);
  }, [setOptions, word, goBack, favorites, handleFavoriteWord, isError]);

  if (isLoadingScreen) {
    return (
      <View style={style.containerLoader}>
        <ActivityIndicator color={colors.SECONDARY} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[style.wordContent, style.errorContent]}>
        <Text style={style.errorTitle}>Not found the word: {word}</Text>
        <Text style={style.errorText}>Choose another word</Text>
      </View>
    );
  }

  return (
    <ScrollView style={style.container}>
      <View style={style.wordContent}>
        <Text style={style.wordText}>{word}</Text>
        {phonetic?.text && <Text style={style.text}>{phonetic.text}</Text>}

        <SoundPlayer
          isAvailable={isAvailable}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={onPlayPause}
        />
      </View>

      <MeaningsList meanings={wordDetails?.meanings} />
    </ScrollView>
  );
}
