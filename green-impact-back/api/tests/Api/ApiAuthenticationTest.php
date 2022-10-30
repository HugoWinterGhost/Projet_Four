<?php

/*
 * This file is part of FAme.
 *
 * Participants :
 *     - Markcley Inza-Cruz <markcley@fitness-academie.fr>
 *     - Simon Baconnais <simon@fitness-academie.fr>
 *
 * Creation : 01/01/2021
 * Last update : 29/04/2021
 *
 * (c) Fitness Académie 2021
 */

namespace App\Tests;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;

/**
 * ApiAuthenticationTestCase
 *
 * This class is used to instantiate a connexion with the database
 * and testing it.
 *
 * @package Authentication
 * @author Markcley Inza-Cruz <markcley@fitness-academie.dr>
 */
abstract class ApiAuthenticationTest extends ApiTestCase
{
    /**
     * @var string $token <p>Generated bearer token</p>
     */
    private $token;

    /**
     * Set up
     * @return void
     */
    public function setUp(): void
    {
        self::bootKernel();
    }

    /**
     * Create client with credentials
     *
     * Create a client with a valid bearer token.
     * If token is not provided, it will be generated using getToken() function.
     *
     * @param string $token <p>The bearer token (default: null)</p>
     * @return Client
     */
    protected function createClientWithCredentials(string $token = null): Client
    {
        $token = $token ?: $this->getToken();
        return static::createClient([], ['headers' => ['authorization' => 'Bearer '.$token]]);
    }

    /*
     * Use other credentials if needed
     *
     * Generates a token with :
     *     email : test@example.com
     *     password : secret
     *
     * @return string
     */
    protected function getToken(): string
    {
        if ($this->token) {
            return $this->token;
        }

        $response = self::createClient()->request('POST', '/authentication_token', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'test@example.com',
                'password' => 'secret',
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $data = json_decode($response->getContent());
        $this->token = $data->token;

        return $this->token;
    }
}
