import { isInjectable, getInjectableName } from './Injectable'

const $INJECT = '$inject'
const $$INJECT = Symbol('@Inject(...)')

export function getInjects(injected) {
    return injected[$$INJECT] || []
}

export function Inject(...dependencies) {
    return function(clazz, name, descriptor) {
        let toBeInjected = (descriptor || {}).value || clazz
        if (typeof toBeInjected !== 'function')
            throw new TypeError('element to be injected must be a class')

        let dependencyNames = dependencies.map((dep) => {
            if (isInjectable(dep))
                return getInjectableName(dep)
            else if (typeof dep === 'string')
                return dep
            else
                throw new TypeError('dependency is not an Injectable nor an angular dep')
        })
        Object.defineProperty(toBeInjected, $$INJECT, { value: dependencies })
        Object.defineProperty(toBeInjected, $INJECT, { value: dependencyNames })
    }
}