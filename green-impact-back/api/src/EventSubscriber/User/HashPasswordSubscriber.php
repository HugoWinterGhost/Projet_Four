<?php

namespace App\EventSubscriber\User;

use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Authentication failure listener
 *
 * @package Authentication
 */
class HashPasswordSubscriber implements EventSubscriberInterface
{

    /**
     * @var UserPasswordHasherInterface Interface passwordHasher
     */
    private $passwordHasher;

    /**
     * Constructor
     *
     * @param  UserPasswordHasherInterface $passwordHasher
     * @return void
     */
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * Get subscribed events
     *
     * @return void|array<string, array<int, int|string>>
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['onUser', EventPriorities::PRE_VALIDATE],
        ];
    }

    /**
     * Hash password
     *
     * @param  ViewEvent $event
     * @return mixed
     */
    public function onUser(ViewEvent $event): mixed
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$user instanceof User)
        {
            return array();
        } else if (Request::METHOD_POST === $method
            || Request::METHOD_PUT === $method
            || Request::METHOD_PATCH === $method)
        {
            $content = $event->getRequest()->getContent();
            if( isset(json_decode($content, true)["password"]) ){
                $user->setPassword($this->passwordHasher->hashPassword(
                    $user,
                    $user->getPassword()
                ));

                return $event->setControllerResult($user);
            }
        }
        return array();
    }
}
