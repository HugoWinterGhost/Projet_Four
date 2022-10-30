<?php

/*
 * This file is part of FAme.
 *
 * Participants :
 *     - Simon Baconnais <simon@fitness-academie.fr>
 *
 * Creation : 27/04/2021
 * Last update : 29/04/2021
 *
 * (c) Fitness Académie 2021
 */

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\UserRepository;

/**
 * Authentication success listener
 *
 * @package Authentication
 */
class AuthenticationSuccessListener
{
    /**
     * User repository
     *
     * @var UserRepository Repository of the user
     */
    private UserRepository $userRepository;

    /**
     * Constructor
     *
     * @param  ManagerRegistry $mr
     * @return void
     */
    public function __construct(ManagerRegistry $mr)
    {
        $this->userRepository = new UserRepository($mr);
    }

    /**
     * On authentication success response
     *
     * Customize Lexik JWT response on login success.
     * Add User object to the response.
     *
     * @param  AuthenticationSuccessEvent $event
     * @return void
     */
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();

        /**
         * @todo Find why getUsername returns email and kinf of fix it. It's confusing cause username doesn't exists on User entity.
         */
        if (!$user instanceof User) {
            $user = $this->userRepository->findOneByEmail($user->getUsername());

            if ($user === null) {
                return;
            }
        }

        $data['user'] = [
            'id' => $user->getId(),
            'name' => $user->getUsername(),
            'email' => $user->getEmail(),
            'status' => 'online',
            'avatar' => null
        ];

        $event->setData($data);
    }
}
