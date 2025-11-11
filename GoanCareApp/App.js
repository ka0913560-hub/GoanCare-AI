import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Alert, SafeAreaView } from 'react-native';
import 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_BASE = 'https://goancare-ai.onrender.com';

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // {id, role, content, ts}
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { id: Date.now(), role: 'user', content: text, ts: new Date() };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);
    scrollToEnd();
    try {
      const response = await fetch(`${API_BASE}/askHealth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, history: nextHistory.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Request failed');
      const aiText = data?.answer || 'No response.';
      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: aiText, ts: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      scrollToEnd();
    } catch (err) {
      Alert.alert('Could not connect to GoanCare server.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, input, loading, messages, scrollToEnd]);

  const clear = useCallback(() => setMessages([]), []);

  const renderItem = ({ item }) => {
    const isUser = item.role === 'user';
    const time = new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <View style={{ marginVertical: 6, alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
        <View style={{
          backgroundColor: isUser ? '#A78BFA' : '#FFFFFF',
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOpacity: isUser ? 0 : 0.08,
          shadowRadius: isUser ? 0 : 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: isUser ? 0 : 2
        }}>
          <Text style={{ color: isUser ? '#fff' : '#1a1a1a' }}>{item.content}</Text>
        </View>
        <Text style={{ fontSize: 11, color: '#F0F0FF', marginTop: 4, alignSelf: isUser ? 'flex-end' : 'flex-start' }}>{time}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#7A5AF8", "#A78BFA"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>GoanCare.AI</Text>
          <Text style={{ color: '#EFE9FF', marginTop: 4 }}>Your Smart Health Assistant</Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 14 }}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            onContentSizeChange={scrollToEnd}
            onLayout={scrollToEnd}
            contentContainerStyle={{ paddingBottom: 12 }}
          />

          {loading && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ActivityIndicator color="#fff" />
              <Text style={{ color: '#fff' }}>GoanCare AI is thinking...</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 16 }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your health question…"
              placeholderTextColor="#E9E2FF"
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.35)',
                borderWidth: 1,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 10,
                color: '#fff'
              }}
            />
            <TouchableOpacity
              onPress={send}
              disabled={!canSend}
              style={{
                backgroundColor: canSend ? '#ffffff' : 'rgba(255,255,255,0.6)',
                borderRadius: 14,
                paddingHorizontal: 16,
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <MaterialCommunityIcons name="send" size={22} color={canSend ? '#7A5AF8' : '#8F86C6'} />
              )}
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity onPress={clear} disabled={loading}>
              <Text style={{ color: '#EFE9FF' }}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}


