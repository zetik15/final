import api from './index';

export const events = {
    getAll: () => api.get('/events'),
    getById: (id) => api.get(`/events/${id}`),
    create: (eventData) => api.post('/events', eventData),
    update: (id, eventData) => api.put(`/events/${id}`, eventData),
    delete: (id) => api.delete(`/events/${id}`),
    deleteUserEvents: async (userId) => {
        // Получаем все события
        const response = await api.get('/events');
        const allEvents = response.data;
        
        // Находим события, где пользователь является организатором
        const userEvents = allEvents.filter(event => 
            String(event.organizerId) === String(userId)
        );
        
        // Удаляем каждое событие пользователя
        const deletePromises = userEvents.map(event => 
            api.delete(`/events/${event.id}`)
        );
        
        // Ждем завершения всех запросов на удаление
        await Promise.all(deletePromises);
        
        return { success: true };
    },
    join: async (eventId, userId) => {
        const response = await api.get(`/events/${eventId}`);
        const eventData = response.data;
        const participants = eventData.participants || [];
        const isParticipants = participants.includes(userId);
        if (isParticipants) {
            return eventData;
        } else {
            const updatedParticipants = [...participants, userId];

            const updatedEvent = {
                ...eventData,
                participants: updatedParticipants
            };

            const updateResponse = await api.put(`/events/${eventId}`, updatedEvent);

            return updateResponse.data;
        }
    },
    leave: async (eventId, userId) => {
        const response = await api.get(`/events/${eventId}`);
        const eventData = response.data;
        const participants = eventData.participants || [];
        if (participants.length > 0) {
            const updatedParticipants = participants.filter(participantId => participantId !== userId);

            const updatedEvent = {
                ...eventData,
                participants: updatedParticipants
            };

            const updateResponse = await api.put(`/events/${eventId}`, updatedEvent);

            return updateResponse.data;
        }

        if (!participants.includes(userId)) {
            return eventData;
        }
    }
}