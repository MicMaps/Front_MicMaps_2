import React from 'react';
import Moment from 'moment';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import * as ViewUtils from '../../../utils/viewUtils';
import MicInfo from '../details/micInfo';

function MicsList({mics, onSelectMic, deleteMode, editMode, onDeleteMicRequest, onEditMicRequest, style, isUserMic, isSearchResult, searchQuery}) {

  let shortedList = mics ? shortMicsByTime(mics) : [];
  
  return (
      <View
        style={[styles.container, style, isSearchResult?{marginTop:0}:{}]}>
        {searchQuery && isSearchResult?
          <View style={{alignItems: 'center', marginBottom: 10, marginTop: 10}}>
            <Text style={styles.searchResultText}>Search Results for '{searchQuery}'</Text>
          </View>
          :null
        }
        <ScrollView contentContainerStyle={{ paddingBottom: 75 }}>
        {shortedList.map((mic, idx) => {
          return (
            <TouchableOpacity
              style={[styles.micItemContainer, isSearchResult?{height: 200}:{}, idx === 0? styles.firstMicItem:{}]}
              key={idx}
              onPress={() => onSelectMic ? onSelectMic(mic._id) : null}>
              <MicInfo viewMode={'list'}
                mic={mic}
                editMode={!!editMode}
                deleteMode={deleteMode}
                onEditMicRequest={onEditMicRequest}
                onDeleteMicRequest={onDeleteMicRequest}
                isSearchResult = {isSearchResult} />
            </TouchableOpacity>
          )
        })}
        </ScrollView>
      </View>
  )

  function shortMicsByTime(mics, order = 'asc') {

    let shortedMics = mics.sort((a,b) => {
      let micTimeA = Moment(a.startTime, 'hmm').toDate();
      let micTimeB = Moment(b.startTime, 'hmm').toDate();
      return order === 'asc' ? (micTimeA.getTime() - micTimeB.getTime()) : (micTimeB.getTime() - micTimeA.getTime())
    })
    //console.log("Sorted Mics", shortedMics);
    return shortedMics;
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  },
  titleText: {
    fontSize: 16,
    color: '#444'
  },
  micItemContainer: {
    height: 180,
    width: ViewUtils.WINDOW_WIDTH - 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: ViewUtils.COLOR_THEME_GREEN
  }, 
  firstMicItem: {
    borderTopWidth: 2,
    borderTopColor: ViewUtils.COLOR_THEME_GREEN
  },
  searchResultText: {
    fontSize: 20,
    color: ViewUtils.COLOR_THEME_BLUE
  }
});

export default MicsList;
