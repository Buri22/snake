// class EventBus {
//     subscriptions = { };
//     getNextUniqueId = getIdGenerator();

//     subscribe(eventType, callback) {
//         const id = getNextUniqueId();

//         // create new entry for eventType
//         if(!subscriptions[eventType])
//         {
//             subscriptions[eventType] = { };
//         }

//         // the callback is registered
//         subscriptions[eventType][id] = callback;

//         return {
//             unsubscribe: () => {
//                 delete subscriptions[eventType][id]
//                 if(Object.keys(subscriptions[eventType]).length === 0)
//                     delete subscriptions[eventType]
//             }
//         }
//     }

//     publish(eventType, arg) {
//         if(!subscriptions[eventType])
//           return;

//         Object.keys(subscriptions[eventType])
//               .forEach(id => subscriptions[eventType][id](arg));
//     }
// }

/**
 * subscriptions data format: 
 * { eventType: { id: callback } }
 */
const subscriptions = { }
const getNextUniqueId = getIdGenerator()

function subscribe(eventType, callback) {
    const id = getNextUniqueId()

    if(!subscriptions[eventType])
        subscriptions[eventType] = { }

    subscriptions[eventType][id] = callback

    return { 
        unsubscribe: () => {
            delete subscriptions[eventType][id]
            if(Object.keys(subscriptions[eventType]).length === 0) delete subscriptions[eventType]
        }
    }
}

function publish(eventType, arg) {
    if(!subscriptions[eventType])
        return

    Object.keys(subscriptions[eventType]).forEach(key => subscriptions[eventType][key](arg))
}

function getIdGenerator() {
    let lastId = 0
    
    return function getNextUniqueId() {
        lastId += 1
        return lastId
    }
}

module.exports = { publish, subscribe }