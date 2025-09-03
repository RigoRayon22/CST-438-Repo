// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your apphfjdks!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// EventsScreen.js
import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SAMPLE_EVENTS = [
  {
    id: '1',
    name: 'The Lumineers: Live',
    dateLabel: 'Fri • Oct 10',
    timeLabel: '8:00 PM',
    venue: 'Golden 1 Center',
    cityState: 'Sacramento, CA',
    priceLabel: 'From $45',
    image: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?q=80&w=1200&auto=format&fit=crop',
    genre: 'Concerts',
  },
  {
    id: '2',
    name: 'Warriors vs. Lakers',
    dateLabel: 'Sat • Oct 11',
    timeLabel: '7:30 PM',
    venue: 'Chase Center',
    cityState: 'San Francisco, CA',
    priceLabel: 'From $68',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
    genre: 'Sports',
  },
  {
    id: '3',
    name: 'Wicked (Tour)',
    dateLabel: 'Sun • Oct 12',
    timeLabel: '2:00 PM',
    venue: 'Orpheum Theatre',
    cityState: 'San Francisco, CA',
    priceLabel: 'From $59',
    image: 'https://images.unsplash.com/photo-1485561453753-0b7f51f645b4?q=80&w=1200&auto=format&fit=crop',
    genre: 'Arts & Theater',
  },
];

const FILTERS = ['Today', 'This Week', 'Concerts', 'Sports', 'Arts', 'Near Me'];

export default function EventsScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('This Week');
  const [activeTab, setActiveTab] = useState('All');
  const [savedEventIds, setSavedEventIds] = useState([]);

  const toggleSave = (id) => {
    setSavedEventIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const filteredEvents = useMemo(() => {
    return SAMPLE_EVENTS.filter((event) => {
      const matchesTab =
        activeTab === 'All' || savedEventIds.includes(event.id);

      const matchesQuery =
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.venue.toLowerCase().includes(query.toLowerCase()) ||
        event.cityState.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        FILTERS.includes(activeFilter) &&
        (['Concerts', 'Sports', 'Arts'].includes(activeFilter)
          ? event.genre.includes(activeFilter)
          : true); // genre filter only for those 3

      return matchesTab && matchesQuery && matchesFilter;
    });
  }, [query, activeFilter, activeTab, savedEventIds]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* App Bar */}
      <View style={styles.appbar}>
        <Text style={styles.title}>Discover Events</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          style={styles.avatar}
        >
          <Text style={{ fontWeight: '700' }}>AE</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} style={styles.searchIcon} />
        <TextInput
          placeholder="Search artists, teams, venues…"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
        <Pressable style={styles.filterBtn} accessibilityLabel="Open filters">
          <Ionicons name="options-outline" size={18} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['All', 'Saved'].map((t) => (
          <Pressable
            key={t}
            onPress={() => setActiveTab(t)}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: activeTab === t }}
          >
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS}
        keyExtractor={(x) => x}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setActiveFilter(item)}
            style={[styles.chip, activeFilter === item && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: activeFilter === item }}
          >
            <Text style={[styles.chipText, activeFilter === item && styles.chipTextActive]}>
              {item}
            </Text>
          </Pressable>
        )}
      />

      {/* Events */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            isSaved={savedEventIds.includes(item.id)}
            onToggleSave={() => toggleSave(item.id)}
          />
        )}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </SafeAreaView>
  );
}

function EventCard({ item, isSaved, onToggleSave }) {
  const onShare = async () => {
    try {
      await Share.share({
        message: `${item.name} at ${item.venue}, ${item.cityState} on ${item.dateLabel} at ${item.timeLabel}. Tickets: ${item.priceLabel}`,
      });
    } catch (error) {
      console.log('Share failed', error);
    }
  };

  return (
    <Pressable style={styles.card} accessibilityRole="button">
      <View style={styles.imageWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={24} />
          </View>
        )}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{item.dateLabel}</Text>
        </View>
        <Pressable style={styles.heartBtn} accessibilityLabel="Save event" onPress={onToggleSave}>
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={18} color={isSaved ? 'red' : 'black'} />
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.eventName}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.venueText}>
          {item.venue} • {item.cityState}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Ionicons name="time-outline" size={14} />
            <Text style={styles.metaPillText}>{item.timeLabel}</Text>
          </View>
          <View style={styles.metaPill}>
            <Ionicons name="pricetag-outline" size={14} />
            <Text style={styles.metaPillText}>{item.priceLabel}</Text>
          </View>
          <View style={[styles.metaPill, styles.genrePill]}>
            <Text style={[styles.metaPillText, styles.genrePillText]}>{item.genre}</Text>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <Pressable style={styles.ctaBtn} accessibilityLabel="View details">
            <Text style={styles.ctaText}>Details</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} accessibilityLabel="Share" onPress={onShare}>
            <Ionicons name="share-outline" size={16} />
            <Text style={styles.secondaryText}>Share</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  appbar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '700' },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e8e8ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  searchIcon: { marginRight: 6, opacity: 0.8 },
  searchInput: { flex: 1, height: 44 },
  filterBtn: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  tabActive: { backgroundColor: '#111827' },
  tabText: { fontWeight: '600', color: '#111827' },
  tabTextActive: { color: '#ffffff' },
  filterList: { paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontWeight: '600', color: '#111827' },
  chipTextActive: { color: '#ffffff' },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  card: {
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { height: 4, width: 0 } },
      android: { elevation: 2 },
    }),
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 160 },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
  dateBadge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(17,24,39,0.9)',
  },
  dateBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  heartBtn: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  cardBody: { padding: 12, gap: 6 },
  eventName: { fontSize: 16, fontWeight: '700' },
  venueText: { color: '#6b7280' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  metaPillText: { fontSize: 12, fontWeight: '600', color: '#111827' },
  genrePill: { backgroundColor: '#111827', borderColor: '#111827' },
  genrePillText: { color: '#ffffff' },
  ctaRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ececec',
    backgroundColor: '#fff',
  },
  secondaryText: { fontWeight: '700', color: '#111827' },
});
