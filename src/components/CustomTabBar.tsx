import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigationStore } from '../store/navigationStore';
import { COLORS } from '../constants';

type Tab = 'travel-events' | 'charging-sessions' | 'export';

interface TabConfig {
  name: Tab;
  label: string;
  icon: string;
}

const tabs: TabConfig[] = [
  { name: 'travel-events', label: 'Travel Events', icon: 'car' },
  { name: 'charging-sessions', label: 'Charging', icon: 'lightning-bolt' },
  { name: 'export', label: 'Export', icon: 'download' },
];

export const CustomTabBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const activeTab = useNavigationStore((state) => state.activeTab);
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.name}
          style={[styles.tab, activeTab === tab.name && styles.activeTab]}
          onPress={() => setActiveTab(tab.name)}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.name ? COLORS.primary : COLORS.textSecondary}
          />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },
});
