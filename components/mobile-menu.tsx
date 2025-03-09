"use client"

import { Fragment } from "react"
import Link from "next/link"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NavigationLink } from "@/lib/types/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  links: NavigationLink[]
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-[#1B2531] shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
                          <X className="h-6 w-6" />
                          <span className="sr-only">Close menu</span>
                        </Button>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      <nav className="space-y-1">
                        {links.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="block px-3 py-4 text-base font-medium text-white hover:bg-[#2a3744] hover:text-[#40C4FF] transition-colors rounded-lg"
                            onClick={onClose}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

