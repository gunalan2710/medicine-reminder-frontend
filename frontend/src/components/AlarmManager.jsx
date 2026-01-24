import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import reportService from '../services/reportService';

const AlarmManager = () => {
    const { isAuthenticated } = useAuth();
    const [notifiedDoses, setNotifiedDoses] = useState(new Set());

    const requestNotificationPermission = useCallback(async () => {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        }
    }, []);

    const playAlarmSound = useCallback(() => {
        try {
            // Standard notification sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
        } catch (error) {
            console.error('Error playing alarm sound:', error);
        }
    }, []);

    const showNotification = useCallback((dose) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification('Medicine Reminder! 💊', {
                body: `Time to take ${dose.medicineName} (${dose.dosage})`,
                icon: '/favicon.ico',
                tag: dose.id, // Prevent duplicate notifications for same dose
                requireInteraction: true // Keep notification until user interacts
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            playAlarmSound();
        }
    }, [playAlarmSound]);

    const checkDoses = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const response = await reportService.getTodayReport();
            if (response.success && response.data?.doses) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                response.data.doses.forEach(dose => {
                    // dose.scheduledTime is expected as "HH:mm" or "HH:mm:ss"
                    const [scheduledHour, scheduledMinute] = dose.scheduledTime.split(':').map(Number);

                    // Only notify if status is PENDING, hour and minute match, and not already notified this session
                    if (dose.status === 'PENDING' &&
                        scheduledHour === currentHour &&
                        scheduledMinute === currentMinute &&
                        !notifiedDoses.has(dose.id)) {

                        showNotification(dose);
                        setNotifiedDoses(prev => new Set([...prev, dose.id]));
                    }
                });
            }
        } catch (error) {
            console.error('Error checking doses for alarm:', error);
        }
    }, [isAuthenticated, notifiedDoses, showNotification]);

    useEffect(() => {
        if (isAuthenticated) {
            requestNotificationPermission();

            // Check every 10 seconds
            const interval = setInterval(checkDoses, 10000);

            // Initial check
            checkDoses();

            return () => clearInterval(interval);
        }
    }, [isAuthenticated, checkDoses, requestNotificationPermission]);

    // Clear notified doses once a day at midnight
    useEffect(() => {
        const now = new Date();
        const night = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // the next day,
            0, 0, 0 // at 00:00:00
        );
        const msToMidnight = night.getTime() - now.getTime();

        const timeout = setTimeout(() => {
            setNotifiedDoses(new Set());
        }, msToMidnight);

        return () => clearTimeout(timeout);
    }, [notifiedDoses]);

    return null; // This component doesn't render anything
};

export default AlarmManager;
