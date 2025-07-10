import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GroupService from '@services/backend/concrete/group.service';
import {useGroupStore} from '@stores/group.store';
import {AppState, NetInfo} from 'react-native';
import {BackendError} from '@services/backend/concrete/backend.error';

export interface UseGroupProps {
  groupId: string;
  detailed?: boolean;
  cache?: boolean;
  cacheExpiration?: number;
  retryCount?: number;
  retryDelay?: number;
  pageSize?: number;
  backgroundFetchInterval?: number;
}

export default function useGroup({
  groupId,
  detailed = false,
  cache = false,
  cacheExpiration = 300000, // 5 dakika
  retryCount = 3,
  retryDelay = 1000,
  pageSize = 10,
  backgroundFetchInterval = 300000,
}: UseGroupProps) {
  const {group, setGroup, loading, setLoading, error, setError} =
    useGroupStore();
  const groupService = new GroupService();
  const cacheKey = `group_${groupId}_${detailed}`;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [lastNetworkTime, setLastNetworkTime] = useState(Date.now());
  const minInterval = 30000; // 30 saniye minimum bekleme süresi

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchGroup = async (attempt = 1, reset = false) => {
    setLoading(true);
    try {
      let fetchedGroup;
      let offset = reset ? 0 : (page - 1) * pageSize;

      if (cache && reset) {
        await clearCache();
      }

      if (cache && !reset) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          const {data, timestamp} = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > cacheExpiration;
          if (!isExpired) {
            setGroup(data);
            setLoading(false);
            return;
          }
        }
      }

      fetchedGroup = await groupService.getGroup(
        groupId,
        detailed,
        offset,
        pageSize,
      );

      if (reset) {
        setGroup(fetchedGroup);
      } else {
        setGroup(prev => ({
          ...prev,
          users: [...(prev?.users || []), ...(fetchedGroup.users || [])],
        }));
      }

      setHasMore(fetchedGroup.hasMore ?? fetchedGroup.users.length >= pageSize);

      if (cache && fetchedGroup.users.length > 0) {
        const existingCache = await AsyncStorage.getItem(cacheKey);
        let updatedCache;
        if (existingCache) {
          const {data} = JSON.parse(existingCache);
          updatedCache = {
            data: {
              ...data,
              users: [...data.users, ...fetchedGroup.users],
            },
            timestamp: Date.now(),
          };
        } else {
          updatedCache = {data: fetchedGroup, timestamp: Date.now()};
        }
        await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedCache));
      }
    } catch (err: any) {
      if (err instanceof BackendError) {
        if (err.status === 416 || err.status === 404) {
          setHasMore(false);
        } else if (attempt < retryCount) {
          console.warn(`Retrying... (${attempt}/${retryCount})`);
          await sleep(retryDelay);
          await fetchGroup(attempt + 1, reset);
        } else {
          setError('Grup çekilirken hata oluştu.');
        }
      } else {
        console.error('Bilinmeyen bir hata oluştu:', err);
        setError('Bilinmeyen bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(cacheKey);
    } catch (err) {
      console.error('Cache temizlenirken hata oluştu:', err);
    }
  };

  const refresh = async () => {
    setPage(1);
  };

  useEffect(() => {
    if (page === 1) {
      fetchGroup(1, true);
    }
  }, [page]);

  const loadMore = async () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    const backgroundFetch = setInterval(() => {
      console.log('Background Fetch Başlatıldı');
      refresh();
    }, backgroundFetchInterval);

    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          nextAppState === 'active' &&
          Date.now() - lastActiveTime > minInterval
        ) {
          console.log('App Foreground’a geldi, Yenile');
          refresh();
          setLastActiveTime(Date.now());
        }
      },
    );

    const networkListener = NetInfo.addEventListener(state => {
      if (state.isConnected && Date.now() - lastNetworkTime > minInterval) {
        console.log('İnternet bağlantısı geri geldi, veri yenileniyor...');
        refresh();
        setLastNetworkTime(Date.now());
      }
    });

    return () => {
      clearInterval(backgroundFetch);
      appStateListener.remove();
      networkListener.remove();
    };
  }, []);

  useEffect(() => {
    fetchGroup();
  }, [groupId, detailed, cache, cacheExpiration, page]);

  return {group, loading, error, clearCache, refresh, loadMore, hasMore};
}
