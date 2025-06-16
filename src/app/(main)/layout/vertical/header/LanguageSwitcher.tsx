'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
// 1. Import Icon จาก @iconify/react แทน Image
import { Icon } from '@iconify/react';

// 2. เปลี่ยนค่า flag จาก path ไฟล์ เป็น Iconify identifier
const languages = [
  { code: 'th', name: 'ภาษาไทย', flag: 'circle-flags:th' },
  { code: 'en', name: 'English', flag: 'circle-flags:gb' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const selectedLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLangChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="relative w-25">
      <Listbox value={selectedLanguage.code} onChange={handleLangChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="flex items-center">
              {/* 3. แทนที่ <Image> ด้วย <Icon> */}
              <Icon
                icon={selectedLanguage.flag}
                className="mr-2 h-5 w-5"
              />
              <span className="block truncate">{selectedLanguage.name}</span>
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {languages.map((lang) => (
                <Listbox.Option
                  key={lang.code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={lang.code}
                >
                  {({ selected }) => (
                    <>
                      <span className={`flex items-center ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {/* 4. แทนที่ <Image> ด้วย <Icon> ในส่วนของ options ด้วย */}
                        <Icon
                          icon={lang.flag}
                          className="mr-2 h-5 w-5"
                        />
                        {lang.name}
                      </span>
                     
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}