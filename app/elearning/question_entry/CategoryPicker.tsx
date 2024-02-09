"use client"
import {Dispatch, Fragment, SetStateAction, useState} from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
export interface categoryinterface{
    id:number,
    name:string,
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function CategoryPicker({category, selectedCategory, setSelectedCategory}:{category:Array<categoryinterface>,selectedCategory:categoryinterface,setSelectedCategory:Dispatch<SetStateAction<{id: number, name: string}>>}) {
    return (
        <Listbox value={selectedCategory} onChange={setSelectedCategory}>
            {({ open }) => (
                <>
                    <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 rounded-lg py-1.5 pl-3 pr-10 text-left text-gray-900 border-2 sm:text-sm sm:leading-6">
                            <span className="block truncate">{selectedCategory.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {category.map((category) => (
                                    <Listbox.Option
                                        key={category.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={category}
                                    >
                                        {({ selected, active }) => (
                                            <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {category.name}
                        </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
