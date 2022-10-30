<?php

namespace App\Entity\Main;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Serializer\Filter\GroupFilter;
use App\Entity\MediaObject;
use App\Entity\User;
use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ApiResource(
    itemOperations: [
        'get',
        'patch',
        'delete'
    ],
    normalizationContext: ['groups' => ['events']]
)]
#[ApiFilter(
    GroupFilter::class,
    arguments: [
        'parameterName' => 'group'
    ]
)]

class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['events'])]
    private $id;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['events'])]
    #[Assert\NotBlank]
    private $title;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['events'])]
    private $description;

    #[ORM\Column(type: "datetime", nullable: true)]
    #[Groups(['events'])]
    private $startAt;

    #[ORM\Column(type: "datetime", nullable: true)]
    #[Groups(['events'])]
    private $endAt;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['events'])]
    private $city = "";

    #[ORM\Column(type: "json", nullable: true)]
    #[Groups(['events'])]
    private $addresses = [];

    #[ORM\Column(type: "json", nullable: true)]
    #[Groups(['events'])]
    private $status = [];

    #[ORM\Column(type: 'integer')]
    #[Groups(['events'])]
    private $nbWorkshop = 0;

    #[ORM\Column(type: 'integer')]
    #[Groups(['events'])]
    private $nbVolunteer = 0;

    #[ORM\Column(type: 'integer')]
    #[Groups(['events'])]
    private $nbStand = 0;

    #[ORM\ManyToOne(targetEntity: MediaObject::class, cascade: ["remove"])]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(iri: 'http://schema.org/image')]
    #[Groups(['events'])]
    private ?MediaObject $image = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: "events")]
    #[Groups(['events'])]
    private $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStartAt(): ?\DateTimeInterface
    {
        return $this->startAt;
    }

    public function setStartAt(?\DateTimeInterface $startAt): self
    {
        $this->startAt = $startAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeInterface
    {
        return $this->endAt;
    }

    public function setEndAt(?\DateTimeInterface $endAt): self
    {
        $this->endAt = $endAt;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getAddresses(): ?array
    {
        return $this->addresses;
    }

    public function setAddresses(?array $addresses): self
    {
        $this->addresses = $addresses;

        return $this;
    }

    public function getStatus(): ?array
    {
        return $this->status;
    }

    public function setStatus(?array $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getNbWorkshop(): ?int
    {
        return $this->nbWorkshop;
    }

    public function setNbWorkshop(int $nbWorkshop): self
    {
        $this->nbWorkshop = $nbWorkshop;

        return $this;
    }

    public function getNbVolunteer(): ?int
    {
        return $this->nbVolunteer;
    }

    public function setNbVolunteer(int $nbVolunteer): self
    {
        $this->nbVolunteer = $nbVolunteer;

        return $this;
    }

    public function getNbStand(): ?int
    {
        return $this->nbStand;
    }

    public function setNbStand(int $nbStand): self
    {
        $this->nbStand = $nbStand;

        return $this;
    }

    /**
     * @return \App\Entity\ECommerce\Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        $this->users->removeElement($user);

        return $this;
    }

    /**
     * @return MediaObject|null
     */
    public function getImage(): ?MediaObject
    {
        return $this->image;
    }

    /**
     * @param MediaObject|null $image
     */
    public function setImage(?MediaObject $image): void
    {
        $this->image = $image;
    }
}
