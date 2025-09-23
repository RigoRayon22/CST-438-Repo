import React from 'react';
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Event } from '../../types';

// Props (inputs) for EventModal: takes an Event (or null) and a function to close the modal
interface EventModalProps {
    event: Event | null;
    onClose: () => void;
}

/** modal component for event details (when event is clicked) */
export function EventModal({ event, onClose }: EventModalProps) {
    if (!event) return null;

    const venue = event._embedded?.venues?.[0];
    const performers = event._embedded?.attractions?.map((a) => a.name) || [];
    const category = event.classifications?.[0]?.segment?.name || "General";

    const localDate = event.dates?.start?.localDate;
    const localTime = event.dates?.start?.localTime;
    let formattedDate = localDate ?? 'Unknown date';
    try {
        if (localDate) {
        // combine date + time if available
        const iso = localTime ? `${localDate}T${localTime}` : `${localDate}T00:00`;
        const d = new Date(iso);
        formattedDate = d.toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: localTime ? 'numeric' : undefined,
            minute: localTime ? '2-digit' : undefined,
        });
        }
    } catch (e) {
        // fallback leave formattedDate as localDate
    }

    return (
        <Modal transparent={true} animationType="slide" visible={! !event}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeIcon}>✖</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{event.name}</Text>
                    <Text style={styles.details}>📅 {formattedDate}</Text>
                    {venue && (
                        <Text style={styles.details}>
                        📍 {venue.city?.name ?? 'Unknown city'} • {venue.name ?? 'Unknown venue'}
                        </Text>
                    )}
                    {performers.length > 0 && (
                        <Text style={styles.details}>🎤 {performers.join(", ")}</Text>
                    )}
                    <Text style={styles.details}>🎭 {category}</Text>
                    {event.url && (
                        <TouchableOpacity onPress={() => Linking.openURL(event.url!)}>
                            <Text style={[styles.details, styles.link]}>🎟️ Get Tickets</Text>
                        </TouchableOpacity>
                    )}
                    <Button title="⭐ Save Event" onPress={() => { }} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000088)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeIcon: {
        fontSize: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    details: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    link: {
        color: "blue",
        textDecorationLine: "underline",
        marginBottom: 12,
    },
});